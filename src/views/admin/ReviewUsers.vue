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
        disable-sort
        item-key="name"
        :loading="loading"
        loading-text="Загрузка... Пожалуйста подождите"
        sort-by="nameGroup"
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
          text: "Дата оплаты",
          value: "datePay"
        },
        {
          text: "Статус оплаты",
          value: "actions"
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
      dialogRemoveUser: false
    };
  },
  created() {
    this.updateTable();
  },
  computed: {
    ...mapGetters({
      allUsersState: "ALLUSERS"
    })
  },
  methods: {
    ...mapActions({
      getAllUsers: "GET_ALL_USERS",
      setPayStatus: "SEND_PAY_SUB",
      deleteUser: "DELETE_USER_GROUP"
    }),
    updateTable() {
      this.loading = true;
      this.sampleUsers = [];
      this.getAllUsers();
      this.sampleUsers = this.allUsersState;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
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
