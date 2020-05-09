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
        :items="sampleTable"
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
            style="margin-left:94%"
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
          text: "Название группы",
          value: "nameGroup"
        },
        {
          text: "Дата оплаты",
          value: "datePay"
        },
        {
          text: "Тренер",
          value: "coach"
        }
      ],
      loading: false,
      pageCount: 1,
      selectPhone: "",
      selectName: "",
      searchFilter: "",
      sampleTable: []
    };
  },
  created() {
    this.updateTable();
  },
  computed: {
    ...mapGetters({
      allHistory: "SINGLEHISTORY"
    })
  },
  methods: {
    ...mapActions({
      getHistory: "GET_ALL_SINGLE_HISTORY"
    }),
    updateTable() {
      this.loading = true;
      this.sampleTable = [];
      this.getHistory();
      setTimeout(() => {
        this.sampleTable = this.allHistory;
        this.loading = false;
      }, 1500);
    },
    clearFilter() {
      this.selectPhone = "";
      this.selectName = "";

      this.searchFilter = "";
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
