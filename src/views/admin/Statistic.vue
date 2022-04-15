<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row>
        <v-col cols="12" sm="12" lg="6">
          <div class="chart_loader" v-show="loadingChart">
            <v-progress-circular indeterminate color="info" :size="50" />
          </div>
          <div v-show="!loadingChart">
            <canvas ref="canvas" class="mt-8"></canvas>
          </div>
        </v-col>
        <v-col cols="12" sm="12" lg="6">
          <v-card class="mx-auto" max-width="550">
            <v-card-text>
              <span class="title font-weight-black"
                >Общий доход за {{ week }}:
                {{ countWorkInMonth.toLocaleString() }}
              </span>
              <br />
              <span class="headline"
                >{{ priceWorkInMonth.toLocaleString() }} KZT -
                {{ priceExpenses.toLocaleString() }} KZT =
                {{ totalWork.toLocaleString() }} KZT
              </span>
              <br />
              <span class="title font-weight-black"
                >Абонементы: {{ countGroupInMonth }}
              </span>
              <br />
              <span class="headline">
                {{ priceGroupInMonth.toLocaleString() }} KZT
              </span>
              <br />
              <span class="title font-weight-black"
                >Индивидуальные занятия: {{ countIndivInMonth }}</span
              >
              <br />
              <span class="headline">
                {{ priceIndivInMonth.toLocaleString() }} KZT
              </span>
              <br />
              <span class="title font-weight-black"
                >Разовые посещения: {{ countSingleInMonth }}
              </span>
              <br />
              <span class="headline">
                {{ priceSingleInMonth.toLocaleString() }} KZT
              </span>
              <br />
              <span class="title font-weight-black"
                >Другие оплаты: {{ countOtherInMonth }}
              </span>
              <br />
              <span class="headline">
                {{ priceOtherInMonth.toLocaleString() }} KZT
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" sm="6" lg="3">
          <v-select
            outlined
            dense
            label="Период"
            :items="itemsWeek"
            v-model="selectWeek"
            @change="filterWeek"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="6" lg="2">
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
        <v-col class="sm-none">
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
            class="update-button ub"
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
import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
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
      countOtherInMonth: 0,
      priceWorkInMonth: 0,
      priceGroupInMonth: 0,
      priceIndivInMonth: 0,
      priceSingleInMonth: 0,
      priceOtherInMonth: 0,
      priceExpenses: 0,
      totalWork: 0,
      itemsWeek: ["За день", "За неделю", "За месяц", "За полгода", "За год"],
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
          text: "Тип",
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
      sampleTable: [],
      dataExp: [],
      allExp: [],
      allData: [],
      loadingChart: false,
      allReports: [],
      allExpenses: [],
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      },
      dataBar: {
        labels: [],
        datasets: [
          {
            label: "# Кол-во абонементов",
            data: [],
            backgroundColor: [
              "rgba(153, 102, 255, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(153, 102, 255, 0.2)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          },
          {
            label: "# Заработанно",
            data: [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      }
    };
  },

  async created() {
    this.loading = true;
    const data = await this.getReports();
    const coachlist = await this.getCoachList();
    const ex = await this.getExpenses();
    this.allReports = data;
    this.allExpenses = ex;
    this.updateTable();

    this.nameExcel = `Отчет  ${this.$moment().format("DD.MM.YYYY")}.xls`;
    this.coachList = coachlist;
    data.forEach(c => {
      Object.values(c).forEach(g => {
        this.allData.push(g);
      });
    });
    this.allExp = ex;
  },
  computed: {
    ...mapGetters({
      // allReports: "PAYREPORTS",
      coachLists: "COACH"
      // allExpenses: "EXPENSES"
    })
  },
  methods: {
    ...mapActions({
      getReports: "GET_ALL_PAY",
      getCoachList: "GET_COACH_LIST",
      getExpenses: "GET_EXPENSES"
    }),
    selectType() {
      if (this.type === "Все" || this.type === undefined) {
        this.sampleTable = this.tableData;
      } else {
        this.sampleTable = this.tableData.filter(c => c.type === this.type);
      }
    },
    ///////////////////////Charts
    async createChartMonth() {
      this.loadingChart = true;

      for (let i = 0; i < 6; i++) {
        let D = new Date();
        D.setMonth(D.getMonth() - i);
        this.dataBar.labels.unshift(D.toLocaleString("ru", { month: "long" }));

        await this.dataBar.datasets[0].data.unshift(
          this.allData.filter(
            c => new Date(c.date.seconds * 1000).getMonth() === D.getMonth()
          ).length
        );
        this.dataBar.datasets[1].data.unshift(
          await this.allData
            .filter(
              c => new Date(c.date.seconds * 1000).getMonth() === D.getMonth()
            )
            .reduce((total, r) => (total += +r.price), 0)
        );
      }

      this.renderChart(this.dataBar, this.options);
      this.loadingChart = false;
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
      this.priceOtherInMonth = 0;
      this.priceExpenses = 0;
      this.totalWork = 0;
      this.sampleTable
        .filter(el => el.type)
        .forEach(c => {
          if (c.type === "Индив") {
            this.countIndivInMonth++;
            this.priceIndivInMonth += +c.price;
          } else if (c.type === "Группа") {
            this.countGroupInMonth++;
            this.priceGroupInMonth += +c.price;
          } else if (c.type === "Разовое") {
            this.countSingleInMonth++;
            this.priceSingleInMonth += +c.price;
          } else {
            this.countOtherInMonth++;
            this.priceOtherInMonth += +c.price;
          }
        });
      this.dataExp.forEach(c => {
        this.priceExpenses += +c.price;
      });
      this.countWorkInMonth =
        this.countIndivInMonth +
        this.countGroupInMonth +
        this.countSingleInMonth +
        this.countOtherInMonth;
      this.priceWorkInMonth =
        this.priceGroupInMonth +
        this.priceIndivInMonth +
        this.priceSingleInMonth +
        this.priceOtherInMonth;
      this.totalWork = this.priceWorkInMonth - this.priceExpenses;
    },
    async toogleGroup() {
      if (this.step === 1) {
        this.step = 2;
        this.sampleTable = await this.tableData.filter(
          c => c.type === "Группа"
        );

        this.groupList = this.sampleTable.map(c => c.nameGroup);
        this.inTotal();
        this.updateFileds();
      } else {
        this.step = 1;
        this.filterWeek();
      }
    },
    async filterWeek() {
      this.sampleTable = [];
      let isFilter;
      switch (this.selectWeek) {
        case "За день":
          {
            isFilter = date =>
              this.$moment(date * 1000).format("DD.MM.YYYY") ==
              this.$moment().format("DD.MM.YYYY");
            this.week = "день";
          }
          break;
        case "За неделю":
          {
            isFilter = date => {
              let mDate = Math.ceil(
                Math.abs(new Date().getTime() - date * 1000) /
                  (1000 * 60 * 60 * 24)
              );
              return mDate <= 7;
            };
          }
          break;
        case "За месяц":
          {
            isFilter = date =>
              new Date(date * 1000).getMonth() == new Date().getMonth() &&
              new Date(date * 1000).getFullYear() == new Date().getFullYear();

            this.week = "месяц";
          }
          break;
        case "За полгода":
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

      await this.allReports.forEach(async c => {
        Object.values(c).forEach(async g => {
          if (g.date !== undefined) {
            if (isFilter(g.date.seconds)) {
              let data = {
                name: g.name,
                date: this.$moment(g.date.seconds * 1000).format("DD.MM.YYYY"),
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
              } else if (g.type === "single") {
                data.type = "Разовое";
              } else if (g.type === "mini") {
                data.type = "Минигруппа";
              } else {
                data.type = "Другая оплата";
              }
              this.sampleTable.push(data);
            }
          }
        });
      });

      this.tableData = this.sampleTable;

      this.createChartMonth();

      this.dataExp = this.allExp.filter(c => isFilter(c.date.seconds));

      if (this.step === 2) {
        this.step = 1;
        this.toogleGroup();
      }

      this.updateFileds();
      this.inTotal();
    },
    inTotal() {
      let summ = 0;
      this.sampleTable.forEach(c => {
        if (c.type != "Всего") {
          summ += +c.price.toLocaleString();
        }
      });

      this.sampleTable = this.sampleTable.filter(g => g.type !== "Всего");
      this.sampleTable.unshift({
        name: "Всего",
        price: summ.toLocaleString()
      });
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
    async updateTable() {
      this.loading = true;
      this.sampleTable = [];
      this.getReports();
      this.week = "месяц";
      await this.filterWeek();
      this.loading = false;
    }
  }
};
</script>
<style scoped>
@media (max-width: 700px) {
  .ub {
    margin-top: 0 !important;
  }
}
</style>
