<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row>
        <v-col cols="6" lg="3" sm="6">
          <v-text-field
            v-model="selectName"
            label="Имя клиента"
            outlined
            dense
            @input="changeFilter(selectName)"
          ></v-text-field>
        </v-col>
        <v-col cols="6" lg="3" sm="6">
          <v-text-field
            v-model="selectPhone"
            label="Номер телефона"
            outlined
            dense
            @input="changeFilter(selectPhone)"
            v-mask="'+7(###)###-##-##'"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn rounded color="info" @click="clearFilter"
            >Очистить фильтр</v-btn
          >
        </v-col>
        <v-col cols="6" lg="3" sm="6" class="mt-n3 sm-none">
          <v-switch v-model="dense" label="Маленькая таблица"></v-switch>
        </v-col>
      </v-row>
      <v-data-table
        :headers="tableHeaders"
        :items="sampleUsers"
        :page.sync="page"
        :dense="dense"
        hide-default-footer
        item-key="id"
        :loading="loading"
        loading-text="Загрузка... Пожалуйста подождите"
        sort-by="datePay"
        @page-count="pageCount = $event"
        :search="searchFilter"
      >
        <template v-slot:top>
          <v-btn
            class="update-button"
            color="success"
            text
            dark
            small
            @click="updateTable()"
          >
            Обновить
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            :disabled="item.paid"
            class="mr-4"
            outlined
            small
            @click="(selectedItem = item), (dialogPay = true)"
            color="success"
            min-width="120"
          >
            {{ item.paid === false ? "Оплатить" : "Оплачен" }}
            <v-icon small v-if="!item.paid" class="ml-1">
              mdi-cash-usd
            </v-icon></v-btn
          >
        </template>
        <template v-slot:item.removes="{ item }">
          <v-icon @click="(selectedItem = item), (dialogRemoveUser = true)"
            >mdi-close</v-icon
          >
        </template>
        <template v-slot:item.edit="{ item }">
          <v-icon @click="editUser(item)">mdi-pencil</v-icon>
        </template>
        <template v-slot:no-data>
          <span
            >Невозможно получить данные либо таблица пуста, попробуйте обновить
            страницу</span
          >
        </template>
      </v-data-table>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        color="success"
      ></v-pagination>
      <v-row justify="center">
        <v-dialog v-model="dialogPay" persistent max-width="400">
          <v-card>
            <v-card-title class="headline">Подтвердить оплату </v-card-title>
            <v-card-text
              >Стоимость абонемента
              <strong>{{ selectedItem.subscription }}тг</strong> Клиент
              <strong> {{ selectedItem.name }}</strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogPay = false"
                >Отмена</v-btn
              >
              <v-btn
                color="green darken-1"
                text
                @click="
                  dialogPay = false;
                  setPayStatus(selectedItem);
                  updatePaidItem();
                "
                >Подтвердить</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogRemoveUser" persistent max-width="400">
          <v-card>
            <v-card-title class="headline">Подтвердить удаление </v-card-title>
            <v-card-text
              >Вы действительно хотите удалить клиента
              <strong> {{ selectedItem.name }}</strong> из группы
              <strong>{{ selectedItem.nameGroup }}</strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogRemoveUser = false"
                >Отмена</v-btn
              >
              <v-btn
                color="green darken-1"
                text
                @click="
                  dialogRemoveUser = false;
                  deleteUser(selectedItem);
                  deleteUserLocal();
                "
                >Подтвердить</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogEditUser" max-width="630">
          <v-card>
            <v-card-title class="headline"
              >Редактирование пользователя
            </v-card-title>
            <v-form ref="formEdit">
              <v-row class="row_null">
                <v-col cols="12" lg="6" sm="12">
                  <v-text-field
                    label="ФИО"
                    dense
                    clearable
                    :rules="$validation.required"
                    v-model="editItem.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" sm="12">
                  <v-text-field
                    dense
                    v-model="editItem.phone"
                    v-mask="'+7(###)###-##-##'"
                    clearable
                    :rules="$validation.phone"
                    label="Телефон"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" sm="12">
                  <v-text-field
                    dense
                    v-model="editItem.price"
                    v-mask="'######'"
                    clearable
                    :rules="$validation.required"
                    label="Цена"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" sm="12">
                  <v-select
                    class="mt-n3"
                    v-model="editItem.group"
                    label="Группа"
                    item-text="name"
                    item-value="name"
                    :items="itemsGroups"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>

            <v-card-actions class="mt-n2">
              <v-btn
                color="success"
                small
                @click="dialogPay = true"
                class="mr-2"
                >Оплатить</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogEditUser = false"
                >Отмена</v-btn
              >
              <v-btn color="green darken-1" text @click="successEdit()"
                >Подтвердить</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-btn
        style="position:fixed!important; bottom:10px; left:10px; z-index:1000;"
        @click="$router.go(-1)"
      >
        <v-icon>mdi-keyboard-backspace</v-icon>
        Назад
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      page: 1,
      dense: false,
      tableHeaders: [
        {
          text: "Имя",
          value: "name"
        },
        {
          text: "Группа",
          value: "nameGroup"
        },
        {
          text: "Телефон",
          value: "phone"
        },
        {
          text: "Оплата",
          value: "subscription"
        },
        {
          text: "Дата регистрации",
          value: "dateRegg"
        },
        {
          text: "Дата оплаты",
          value: "datePay"
        },
        {
          text: "Статус оплаты",
          value: "actions"
        },
        {
          text: "",
          value: "edit"
        },
        {
          text: "",
          value: "removes"
        }
      ],
      loading: false,
      pageCount: 1,
      selectPhone: "",
      selectName: "",
      sampleUsers: [],
      searchFilter: "",
      selectedItem: {},
      itemsGroups: [],
      dialogPay: false,
      dialogRemoveUser: false,
      dialogEditUser: false,
      editItem: {
        id: "",
        name: "",
        group: "",
        phone: "",
        price: "",
        coach: ""
      },
      allUsersState: [],
      allGroupsState: []
    };
  },
  created() {
    this.updateTable();
  },
  computed: {
    ...mapGetters({
      // allUsersState: "ALLUSERS",
      // allGroupsState: "ALLGROUPS"
    })
  },
  methods: {
    ...mapActions({
      getAllUsers: "GET_ALL_USERS",
      getAllGroups: "GET_ALL_GROUPS",
      setPayStatus: "SEND_PAY_SUB",
      deleteUser: "DELETE_USER_GROUP",
      updateUser: "UPDATE_USER_GROUP",
      updateGroup: "UPDATE_GROUP_USERS_TO_USERS"
    }),
    async updateTable() {
      this.loading = true;
      this.sampleUsers = [];
      this.allUsersState = await this.getAllUsers();
      this.allGroupsState = await this.getAllGroups();

      this.itemsGroups = this.allGroupsState.filter(
        c => !c.mini && c.count > 0
      );
      this.sampleUsers = this.allUsersState.map(
        c =>
          (c = {
            ...c,
            dateRegg:
              c.dateReg != undefined
                ? this.$moment(c.dateReg.seconds * 1000).format("DD.MM.YYYY")
                : this.$moment().format("DD.MM.YYYY")
          })
      );
      // this.allGroupsState;
      this.loading = false;
    },
    editUser(item) {
      this.selectedItem = item;
      this.dialogEditUser = true;
      this.editItem = {
        id: item.id,
        name: item.name,
        group: item.nameGroup,
        phone: item.phone,
        price: item.subscription,
        coach: item.coach,
        uidGroup: item.uidGroup
      };
    },
    successEdit() {
      if (this.$refs.formEdit.validate()) {
        this.dialogEditUser = false;
        if (this.selectedItem.nameGroup !== this.editItem.group) {
          this.editItem.coach = this.itemsGroups.find(
            c => c.name === this.editItem.group
          ).coach;
          let data = {
            fromGroup: this.itemsGroups.find(
              c => c.name === this.selectedItem.nameGroup
            ).id,
            toGroup: this.itemsGroups.find(c => c.name === this.editItem.group)
              .id,
            userId: this.editItem.id
          };
          this.editItem.uidGroup = data.toGroup;
          this.updateGroup(data);
        }
        this.updateUser(this.editItem);
        this.updateTableLocal();
      }
    },
    updateTableLocal() {
      const idx = this.sampleUsers.findIndex(
        c => c.id === this.selectedItem.id
      );
      this.sampleUsers[idx].name = this.editItem.name;
      this.sampleUsers[idx].phone = this.editItem.phone;
      this.sampleUsers[idx].subscription = this.editItem.price;
      this.sampleUsers[idx].nameGroup = this.editItem.group;
      this.sampleUsers[idx].uidGroup = this.editItem.uidGroup;
    },
    updatePaidItem() {
      const idx = this.sampleUsers.findIndex(
        c => c.id === this.selectedItem.id
      );
      this.sampleUsers[idx].paid = true;
      this.sampleUsers[idx].datePay = this.$moment().format("DD.MM.YYYY");
      this.sampleUsers[idx].datePayNoformat = new Date();
    },
    deleteUserLocal() {
      this.sampleUsers = this.sampleUsers.filter(
        c => c.id !== this.selectedItem.id
      );
    },
    clearFilter() {
      this.selectPhone = this.selectName = this.searchFilter = "";
    },
    changeFilter(item) {
      this.searchFilter = "";
      if (item === this.selectName) {
        this.searchFilter = this.selectName;
      } else {
        this.searchFilter = this.selectPhone;
      }
    }
  }
};
</script>

<style scoped></style>
