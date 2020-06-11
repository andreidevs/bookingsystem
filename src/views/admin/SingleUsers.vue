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
            clearable
            dense
            @input="changeFilter(selectName)"
          ></v-text-field>
        </v-col>
        <v-col cols="6" lg="3" sm="6">
          <v-text-field
            v-model="selectPhone"
            label="Номер телефона"
            outlined
            clearable
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
        <v-col cols="6" class="mt-n3 sm-none" lg="3" sm="6">
          <v-switch v-model="dense" label="Маленькая таблица"></v-switch>
        </v-col>
      </v-row>
      <v-data-table
        :headers="tableHeaders"
        :items="sampleUsers"
        :page.sync="page"
        :dense="dense"
        disable-sort
        hide-default-footer
        item-key="id"
        :loading="loading"
        loading-text="Загрузка... Пожалуйста подождите"
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
              >Стоимость
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
              <strong> {{ selectedItem.name }}</strong>
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
                    v-model="editItem.coach"
                    label="Тренер"
                    item-text="name"
                    item-value="name"
                    :items="itemsCoach"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <v-card-actions class="mt-n2">
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
          text: "Телефон",
          value: "phone"
        },
        {
          text: "Оплата",
          value: "subscription"
        },
        {
          text: "Тренер",
          value: "coach"
        },
        {
          text: "Дата регистрации",
          value: "dateRegg"
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
      dialogPay: false,
      itemsCoach: [],
      dialogRemoveUser: false,
      dialogEditUser: false,
      editItem: {
        id: "",
        name: "",
        phone: "",
        price: "",
        coach: ""
      }
    };
  },
  created() {
    this.updateTable();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters({
      allSingleState: "ALLSINGLE",
      coachList: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getAllSingle: "GET_ALL_SINGLE",
      setPayStatus: "SEND_PAY_SINGLE",
      deleteUser: "DELETE_USER_SINGLE",
      getCoachList: "GET_COACH_LIST",
      updateUser: "UPDATE_USER_SINGLE"
    }),
    updateTable() {
      this.loading = true;
      this.sampleUsers = [];
      this.getAllSingle();
      this.getCoachList();
      setTimeout(() => {
        this.itemsCoach = this.coachList;
        this.sampleUsers = this.allSingleState.map(
          c =>
            (c = {
              ...c,
              dateRegg:
                c.dateReg != undefined
                  ? new Date(c.dateReg.seconds * 1000).format("dd.mm.yyyy")
                  : new Date().format("dd.mm.yyyy")
            })
        );
        this.loading = false;
      }, 1500);
    },
    editUser(item) {
      this.selectedItem = item;
      this.dialogEditUser = true;
      this.editItem = {
        id: item.id,
        name: item.name,
        phone: item.phone,
        price: item.subscription,
        coach: item.coach
      };
    },
    successEdit() {
      if (this.$refs.formEdit.validate()) {
        this.dialogEditUser = false;
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
      this.sampleUsers[idx].coach = this.editItem.coach;
    },
    clearFilter() {
      this.selectPhone = "";
      this.selectName = "";

      this.searchFilter = "";
    },
    updatePaidItem() {
      const idx = this.sampleUsers.findIndex(
        c => c.id === this.selectedItem.id
      );
      this.sampleUsers[idx].paid = true;
      this.sampleUsers[idx].datePay = new Date().format("dd.mm.yyyy");
      this.sampleUsers[idx].datePayNoformat = new Date();
    },
    deleteUserLocal() {
      this.sampleUsers = this.sampleUsers.filter(
        c => c.id !== this.selectedItem.id
      );
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
