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
          <v-select
            clearable
            label="Тип занятия"
            v-model="type"
            dense
            outlined
            @change="selectType"
            :items="typeItems"
          >
          </v-select>
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
          text: "Тип занятия",
          value: "type"
        },
        {
          text: "Оплата",
          value: "price"
        },
        {
          text: "Дата",
          value: "date"
        },
        {
          text: "Тренер",
          value: "coach"
        }
      ],
      loading: false,
      type: "",
      typeItems: ["Все", "Группа", "Разовое", "Индив"],
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
      allHistory: "PAYHISTORY"
    })
  },
  methods: {
    ...mapActions({
      getHistory: "GET_ALL_PAY_HISTORY"
    }),
    selectType() {
      if (this.type === "Все" || this.type === undefined) {
        this.sampleTable = this.tableData;
      } else {
        this.sampleTable = this.tableData.filter(c => c.type === this.type);
      }
    },
    updateTable() {
      this.loading = true;
      this.sampleTable = [];
      this.getHistory();
      setTimeout(() => {
        this.allHistory.forEach(c => {
          let data = {
            name: c.name,
            date: new Date(c.date.seconds * 1000).format("dd.mm.yyyy"),
            price: c.price,
            coach: c.coach,
            type: ""
          };
          if (c.type === "indiv") {
            data.type = "Индив";
          } else if (c.type === "group") {
            data.type = "Группа";
          } else {
            data.type = "Разовое";
          }
          this.sampleTable.push(data);
        });
        this.tableData = this.sampleTable;
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
