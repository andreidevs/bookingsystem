<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="selectName"
          label="Имя клиента"
          outlined
          dense
          @input="changeFilter(selectName)"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
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
    </v-row>
    <v-data-table
      :headers="tableHeaders"
      :items="sampleUsers"
      :page.sync="page"
      hide-default-footer
      item-key="name"
      :loading="loading"
      loading-text="Загрузка... Пожалуйста подождите"
      sort-by="nameGroup"
      @page-count="pageCount = $event"
      :search="searchFilter"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          :disabled="item.paid"
          class="mr-4"
          outlined
          small
          @click="(selectedItem = item), (dialogPay = true)"
          color="info"
          min-width="120"
        >
          {{ item.paid === false ? "Оплатить" : "Оплачен" }}
          <v-icon small v-if="!item.paid" class="ml-1">
            mdi-cash-usd
          </v-icon></v-btn
        >
      </template>
      <template v-slot:no-data>
        <span
          >К сожалению мы не нашли подходящие тренеровки вернитесь назад и
          измените параметры</span
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
      <v-dialog v-model="dialogPay" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Подтвердить оплату </v-card-title>
          <v-card-text
            >Стоимость абонемента {{ selectedItem.subscription }}тг Клиент
            {{ selectedItem.name }}</v-card-text
          >
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
                updateTable();
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
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      page: 1,
      tableHeaders: [
        {
          text: "Группа",
          value: "nameGroup"
        },
        {
          text: "Имя",
          value: "name"
        },
        {
          text: "Телефон",
          value: "phone"
        },
        {
          text: "Абонемент",
          value: "subscription"
        },
        {
          text: "Дата оплаты",
          value: "datePay"
        },
        {
          text: "Статус оплаты",
          value: "actions"
        }
      ],
      loading: false,
      pageCount: 1,
      selectPhone: "",
      selectName: "",
      sampleUsers: [],
      searchFilter: "",
      selectedItem: {},
      dialogPay: false
    };
  },
  created() {
    this.updateTable();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters({
      allUsersState: "ALLUSERS"
    })
  },
  methods: {
    ...mapActions({
      getAllUsers: "GET_ALL_USERS",
      setPayStatus: "SET_PAY_SUB"
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
