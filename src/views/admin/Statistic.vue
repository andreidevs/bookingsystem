<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row>
        <v-col cols="6"> </v-col>
        <v-col cols="6">
          <v-card class="mx-auto" max-width="450">
            <v-card-text>
              <span class="title font-weight-black"
                >Проданные абонементы за {{ week }}: {{ countWorkInMonth }}
              </span>
              <br />
              <span class="headline">{{ priceWorkInMonth }} KZT</span>
              <br />
              <span class="title font-weight-black"
                >Групповых: {{ countGroupInMonth }}
              </span>
              <br />
              <span class="headline"> {{ priceGroupInMonth }} KZT </span>
              <br />
              <span class="title font-weight-black"
                >Индивидуальных: {{ countIndivInMonth }}</span
              >
              <br />
              <span class="headline"> {{ priceIndivInMonth }} KZT </span>
              <br />
              <span class="title font-weight-black"
                >Разовых: {{ countSingleInMonth }}
              </span>
              <br />
              <span class="headline"> {{ priceSingleInMonth }} KZT </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-select
            outlined
            dense
            label="Период"
            :items="itemsWeek"
            v-model="selectWeek"
            @change="filterWeek"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            outlined
            dense
            label="Тренер"
            clearable
            :items="coachList"
            v-model="selectCoach"
            @change="filterCoach"
          ></v-select>
        </v-col>
        <v-col v-if="step === 2" cols="3">
          <v-select
            outlined
            dense
            label="Название группы"
            clearable
            :items="groupList"
            v-model="selectGroup"
            @change="filterGroup"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            style="margin-top: 2px"
            outlined
            :color="step === 1 ? 'success' : 'accent'"
            @click="toogleGroup"
            ><v-icon v-if="step === 1">mdi-account</v-icon>
            <v-icon v-if="step === 2">mdi-arrow-left</v-icon>
            <span v-if="step === 1">По группам</span>
            <span v-if="step === 2">Назад</span>
          </v-btn>
        </v-col>
        <v-col>
          <export-excel
            :data="sampleTable"
            :fields="excel_fields"
            :name="nameExcel"
          >
            <v-btn
              color="success"
              style="margin-top: 2px"
              :disabled="sampleTable.length > 1 ? false : true"
              >Экспорт в excel</v-btn
            >
          </export-excel>
        </v-col>
      </v-row>
      <v-data-table
        class="mt-n10"
        :headers="step === 1 ? tableHeaders : tableHeadersGroup"
        :items="sampleTable"
        :page.sync="page"
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
            style="margin-left: 92%"
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
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      page: 1,
      nameExcel: "",
      excel_fields: {
        Имя: "name",
        "Тип занятий": "type",
        Тренер: "coach",
        Дата: "date",
        Сумма: "price"
      },
      dense: false,
      week: "месяц",
      step: 1,
      selectWeek: "За месяц",
      selectCoach: "",
      countWorkInMonth: 0,
      countGroupInMonth: 0,
      countIndivInMonth: 0,
      countSingleInMonth: 0,
      priceWorkInMonth: 0,
      priceGroupInMonth: 0,
      priceIndivInMonth: 0,
      priceSingleInMonth: 0,
      itemsWeek: ["За день", "За месяц", "За пол года", "За год"],
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
          text: "Сумма",
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
      tableHeadersGroup: [
        {
          text: "Имя",
          value: "name"
        },
        {
          text: "Тип занятия",
          value: "type"
        },
        {
          text: "Название группы",
          value: "nameGroup"
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
      coachList: [],
      groupList: [],
      typeItems: ["Все", "Группа", "Разовое", "Индив"],
      pageCount: 1,
      selectPhone: "",
      selectGroup: "",
      selectName: "",
      searchFilter: "",
      sampleTable: []
    };
  },
  created() {
    this.updateTable();
    this.getCoachList();
    this.nameExcel = "Отчет " + new Date().format("dd.mm.yyyy");
    this.coachList = this.coachLists;
  },
  computed: {
    ...mapGetters({
      allReports: "PAYREPORTS",
      coachLists: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getReports: "GET_ALL_PAY",
      getCoachList: "GET_COACH_LIST"
    }),
    selectType() {
      if (this.type === "Все" || this.type === undefined) {
        this.sampleTable = this.tableData;
      } else {
        this.sampleTable = this.tableData.filter(c => c.type === this.type);
      }
    },
    updateFileds() {
      this.countWorkInMonth = 0;
      this.countGroupInMonth = 0;
      this.countIndivInMonth = 0;
      this.countSingleInMonth = 0;
      this.priceWorkInMonth = 0;
      this.priceGroupInMonth = 0;
      this.priceIndivInMonth = 0;
      this.priceSingleInMonth = 0;
      this.sampleTable.forEach(c => {
        if (c.type === "Индив") {
          this.countIndivInMonth++;
          this.priceIndivInMonth += parseInt(c.price);
        } else if (c.type === "Группа") {
          this.countGroupInMonth++;
          this.priceGroupInMonth += parseInt(c.price);
        } else {
          this.countSingleInMonth++;
          this.priceSingleInMonth += parseInt(c.price);
        }
      });
      this.countWorkInMonth =
        this.countIndivInMonth +
        this.countGroupInMonth +
        this.countSingleInMonth;
      this.priceWorkInMonth =
        this.priceGroupInMonth +
        this.priceIndivInMonth +
        this.priceSingleInMonth;
    },
    toogleGroup() {
      if (this.step === 1) {
        this.step = 2;
        this.sampleTable = this.tableData.filter(c => c.type === "Группа");
        this.groupList = this.sampleTable.map(c => c.nameGroup);
        this.inTotal();
        this.updateFileds();
      } else {
        this.step = 1;
        this.filterWeek();
      }
    },
    filterWeek() {
      this.sampleTable = [];
      let isFilter;
      switch (this.selectWeek) {
        case "За день":
          {
            isFilter = date =>
              new Date(date * 1000).format("dd.mm.yyyy") ==
              new Date().format("dd.mm.yyyy");
            this.week = "день";
          }
          break;
        case "За месяц":
          {
            isFilter = date =>
              new Date(date * 1000).getMonth() == new Date().getMonth();
            this.week = "месяц";
          }
          break;
        case "За пол года":
          {
            isFilter = date => {
              let mDate = Math.ceil(
                Math.abs(new Date().getTime() - date * 1000) /
                  (1000 * 60 * 60 * 24 * 30)
              );
              return mDate <= 6;
            };
            this.week = "пол года";
          }
          break;
        case "За год":
          {
            isFilter = date => {
              let mDate = Math.ceil(
                Math.abs(new Date().getTime() - date * 1000) /
                  (1000 * 60 * 60 * 24 * 30)
              );
              return mDate <= 12;
            };
            this.week = "год";
          }
          break;
      }
      this.allReports.forEach(c => {
        Object.values(c).forEach(g => {
          if (g.date !== undefined) {
            if (isFilter(g.date.seconds)) {
              let data = {
                name: g.name,
                date: new Date(g.date.seconds * 1000).format("dd.mm.yyyy"),
                dateMill: g.date.seconds * 1000,
                price: g.price,
                coach: g.coach,
                nameGroup: g.nameGroup != undefined ? g.nameGroup : "",
                type: ""
              };
              if (g.type === "indiv") {
                data.type = "Индив";
              } else if (g.type === "group") {
                data.type = "Группа";
              } else {
                data.type = "Разовое";
              }
              this.sampleTable.push(data);
            }
          }
        });
      });

      this.tableData = this.sampleTable;
      this.updateFileds();
      this.inTotal();
      if (this.step === 2) {
        this.step = 1;
        this.toogleGroup();
      }
    },
    inTotal() {
      let summ = 0;
      this.sampleTable.forEach(c => {
        if (c.type != "Всего") {
          summ += parseInt(c.price);
        }
      });

      this.sampleTable = this.sampleTable.filter(g => g.type !== "Всего");
      this.sampleTable.unshift({ name: "Всего", price: summ });
    },
    filterGroup() {
      if (this.selectGroup != undefined && this.selectGroup != "") {
        this.sampleTable = this.tableData.filter(
          c => c.nameGroup === this.selectGroup
        );
      } else {
        this.sampleTable = this.tableData.filter(c => c.type === "Группа");
      }
      this.inTotal();
      this.updateFileds();
    },
    filterCoach() {
      if (this.selectCoach != undefined && this.selectCoach != "") {
        if (this.step === 1) {
          this.sampleTable = this.tableData.filter(
            c => c.coach === this.selectCoach
          );
        } else {
          this.sampleTable = this.tableData.filter(
            c => c.coach === this.selectCoach && c.type === "Группа"
          );
        }
      } else {
        if (this.step === 1) {
          this.sampleTable = this.tableData;
        } else {
          this.sampleTable = this.tableData.filter(c => c.type === "Группа");
        }
      }
      this.updateFileds();
      this.inTotal();
    },
    updateTable() {
      this.loading = true;
      this.sampleTable = [];
      this.getReports();
      this.week = "месяц";
      setTimeout(() => {
        this.filterWeek();
        this.loading = false;
      }, 1500);
    }
  }
};
</script>
<style></style>
