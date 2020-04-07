<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-select
          v-model="selectGroup"
          dense
          outlined
          :items="itemsSelectGroup"
          label="Группа"
        ></v-select
      ></v-col>
      <v-col cols="4">
        <v-text-field v-model="selectName" label="Имя клиента" outlined dense>
        </v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="tableHeaders"
      :items="sampleUsers"
      :page.sync="page"
      hide-default-footer
      item-key="name"
      sort-by="nameGroup"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn class="mr-4" @click="stepTwo(item)" outlined small color="info"
          >Записаться
          <v-icon small>
            mdi-pencil
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
          text: "Дата оплаты",
          value: "datePay"
        },
        {
          text: "Статус оплаты",
          value: "paid"
        },
        {
          text: "",
          value: "actions"
        }
      ],
      tableItems: [],
      pageCount: 1,
      itemsSelectGroup: [],
      selectGroup: "",
      selectName: "",
      allUsers: [],
      changedUsers: [],
      sampleUsers: []
    };
  },
  created() {
    this.getAllUsers();
    this.allUsers = this.allUsersState;
    this.sampleUsers = this.allUsers;
    for (const item in this.allUsers) {
      this.sampleUsers.push(item);
    }
  },
  mounted() {},
  computed: {
    ...mapGetters({
      allUsersState: "ALLUSERS"
    })
  },
  methods: {
    ...mapActions({
      getAllUsers: "GET_ALL_USERS"
    })
  }
};
</script>

<style scoped></style>
