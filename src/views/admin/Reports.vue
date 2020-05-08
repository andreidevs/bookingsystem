<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row>
        <v-col cols="12" sm="12" md="2">
          <v-card style="margin-left: -8%" max-width="200" tile>
            <v-list shaped>
              <v-subheader class="subtitle-1">Отчеты</v-subheader>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item
                  v-for="(item, i) in itemsMenu"
                  :key="i"
                  @click="showReport(i)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              <v-select
                v-model="coach"
                :items="coachList"
                label="Тренер"
                prepend-icon="mdi-account"
                @change="selectCoach"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <export-excel
                :data="tableData"
                :fields="excel_fields"
                :name="nameExcel"
              >
                <v-btn color="success" class="mt-4" :disabled="exportButton"
                  >Экспорт в excel</v-btn
                >
              </export-excel>
            </v-col>
          </v-row>
          <v-data-table
            max-width="700"
            :headers="tableHeaders"
            :items="tableData"
            :page.sync="page"
            hide-default-footer
            disable-sort
            item-key="id"
            :loading="loading"
            loading-text="Загрузка... Пожалуйста подождите"
            @page-count="pageCount = $event"
          >
            <template v-slot:no-data>
              <span
                >Невозможно получить данные либо таблица пуста, попробуйте
                обновить страницу</span
              >
            </template>
          </v-data-table>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            color="success"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      nameExcel: "Отчет",
      exportButton: true,
      excel_fields: {
        "Тип занятий": "type",
        Тренер: "coach",
        Количество: "count",
        Сумма: "summ"
      },
      loading: false,
      coach: "Все",
      item: "",
      itemsMenu: [
        { text: "За день", icon: "mdi-calendar" },
        { text: "За месяц", icon: "mdi-calendar-check" },
        { text: "За пол года", icon: "mdi-calendar-clock" },
        { text: "За год", icon: "mdi-calendar-blank" }
      ],
      sampleTable: [],
      tableData: [],
      tableHeaders: [
        {
          text: "Тип занятий",
          value: "type"
        },
        {
          text: "Тренер",
          value: "coach"
        },
        {
          text: "Количество",
          value: "count"
        },
        {
          text: "Сумма",
          value: "summ"
        }
      ],
      page: 1,
      pageCount: 1
    };
  },
  created() {
    this.loading = true;
    this.getReports();
    this.getCoachList();
    this.coachList = this.coachLists;
    this.coachList.push("Все");
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },

  computed: {
    ...mapGetters({
      allReports: "REPORTS",
      coachLists: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getReports: "GET_REPORTS",
      getCoachList: "GET_COACH_LIST"
    }),
    selectCoach() {
      // console.log("sample", this.sampleTable)
      if (this.coach != "Все") {
        this.tableData = [];
        this.sampleTable.forEach(c => {
          if (c.coach === this.coach || c.type === "Всего") {
            this.tableData.push(c);
          }
        });
      } else {
        this.tableData = this.sampleTable;
      }
      this.inTotal();
    },
    inTotal() {
      let count = 0,
        summ = 0;
      this.tableData.forEach(c => {
        if (c.type != "Всего") {
          count += c.count;
          summ += c.summ;
        }
      });

      this.tableData = this.tableData.filter(g => g.type !== "Всего");
      this.tableData.push({ type: "Всего", count, summ });
    },
    showReport(item) {
      this.tableData = [];
      switch (item) {
        case 0:
          {
            let r = [];
            this.allReports.forEach(c => {
              if (
                c.year === new Date().getFullYear() &&
                c.month === new Date().getMonth()
              ) {
                r.push(c);
              }
            });

            const thisday = "day-" + new Date().getDate();

            r.forEach(c => {
              if (c[thisday] != undefined) {
                if (c[thisday].group.length > 0) {
                  this.tableData.push({
                    coach: c.coach,
                    count: c[thisday].group.length,
                    type: "Группа",
                    summ: c[thisday].group.length * 2000
                  });
                }
                if (c[thisday].indiv.length > -1) {
                  this.tableData.push({
                    coach: c.coach,
                    count: c[thisday].indiv.length,
                    type: "Индив",
                    summ: c[thisday].indiv.length * 1500
                  });
                }
              }
            });
          }
          break;
        case 1:
          {
            let r = [];
            this.allReports.forEach(c => {
              if (
                c.year === new Date().getFullYear() &&
                c.month === new Date().getMonth()
              ) {
                r.push(c);
              }
            });
            r.forEach(c => {
              let groupL = 0,
                indivL = 0;

              for (let i = 0; i < 30; i++) {
                const thisday = "day-" + i;
                if (c[thisday] != undefined) {
                  groupL += c[thisday].group.length;
                  indivL += c[thisday].indiv.length;
                }
              }
              if (groupL > 0) {
                this.tableData.push({
                  coach: c.coach,
                  count: groupL,
                  type: "Группа",
                  summ: groupL * 2000
                });
              }

              if (indivL > 0) {
                this.tableData.push({
                  coach: c.coach,
                  count: indivL,
                  type: "Индив",
                  summ: indivL * 1500
                });
              }
            });
          }
          break;
        case 2:
          {
            let r = [];

            let massdate = [];
            const month = new Date().getMonth();
            let year = new Date().getFullYear();
            let count = 5;
            ////////////////////////////////Месяцы
            for (let i = month; i > 0; i--) {
              massdate.push({ month: i, year: year });
              if (count != 0) {
                count--;
              } else {
                break;
              }
            }
            if (count > 0) {
              year--;

              for (let i = 11; i >= 0; i--) {
                massdate.push({ month: i, year: year });
                if (count != 0) {
                  count--;
                } else {
                  break;
                }
              }
            }

            this.allReports.forEach(c => {
              if (
                (c.year === massdate[0].year &&
                  c.month === massdate[0].month) ||
                (c.year === massdate[1].year &&
                  c.month === massdate[1].month) ||
                (c.year === massdate[2].year &&
                  c.month === massdate[2].month) ||
                (c.year === massdate[3].year &&
                  c.month === massdate[3].month) ||
                (c.year === massdate[4].year &&
                  c.month === massdate[4].month) ||
                (c.year === massdate[5].year && c.month === massdate[5].month)
              ) {
                r.push(c);
              }
            });

            r.forEach(c => {
              let groupL = 0,
                indivL = 0;
              ///////////Дни
              for (let i = 0; i < 30; i++) {
                const thisday = "day-" + i;
                if (c[thisday] != undefined) {
                  groupL += c[thisday].group.length;
                  indivL += c[thisday].indiv.length;
                }
              }
              count = 0;
              if (groupL > 0) {
                if (
                  this.tableData.some(
                    g => g.coach === c.coach && g.type === "Группа"
                  )
                ) {
                  let idx = this.tableData.findIndex(
                    g => g.coach === c.coach && g.type === "Группа"
                  );
                  this.tableData[idx].count += groupL;
                  this.tableData[idx].summ = this.tableData[idx].count * 2000;
                } else {
                  this.tableData.push({
                    coach: c.coach,
                    count: groupL,
                    type: "Группа",
                    summ: groupL * 2000
                  });
                }
              }

              if (indivL > 0) {
                if (
                  this.tableData.some(
                    g => g.coach === c.coach && g.type === "Индив"
                  )
                ) {
                  let idx = this.tableData.findIndex(
                    g => g.coach === c.coach && g.type === "Индив"
                  );
                  this.tableData[idx].count += indivL;
                  this.tableData[idx].summ = this.tableData[idx].count * 1500;
                } else {
                  this.tableData.push({
                    coach: c.coach,
                    count: indivL,
                    type: "Индив",
                    summ: indivL * 1500
                  });
                }
              }
            });

            // this.sampleTable = this.tableData;
          }
          break;
        case 3: {
          let r = [];

          let massdate = [];
          const month = new Date().getMonth();
          let year = new Date().getFullYear();
          let count = 11;
          ////////////////////////////////Месяцы
          for (let i = month; i > 0; i--) {
            massdate.push({ month: i, year: year });
            if (count != 0) {
              count--;
            } else {
              break;
            }
          }
          if (count > 0) {
            year--;

            for (let i = 11; i >= 0; i--) {
              massdate.push({ month: i, year: year });
              if (count != 0) {
                count--;
              } else {
                break;
              }
            }
          }

          this.allReports.forEach(c => {
            if (
              (c.year === massdate[0].year && c.month === massdate[0].month) ||
              (c.year === massdate[1].year && c.month === massdate[1].month) ||
              (c.year === massdate[2].year && c.month === massdate[2].month) ||
              (c.year === massdate[3].year && c.month === massdate[3].month) ||
              (c.year === massdate[4].year && c.month === massdate[4].month) ||
              (c.year === massdate[5].year && c.month === massdate[5].month) ||
              (c.year === massdate[6].year && c.month === massdate[6].month) ||
              (c.year === massdate[7].year && c.month === massdate[7].month) ||
              (c.year === massdate[8].year && c.month === massdate[8].month) ||
              (c.year === massdate[9].year && c.month === massdate[9].month) ||
              (c.year === massdate[10].year &&
                c.month === massdate[10].month) ||
              (c.year === massdate[11].year && c.month === massdate[11].month)
            ) {
              r.push(c);
            }
          });
          r.forEach(c => {
            let groupL = 0,
              indivL = 0;
            ///////////Дни
            for (let i = 0; i < 30; i++) {
              const thisday = "day-" + i;
              if (c[thisday] != undefined) {
                groupL += c[thisday].group.length;
                indivL += c[thisday].indiv.length;
              }
            }
            count = 0;
            if (groupL > 0) {
              if (
                this.tableData.some(
                  g => g.coach === c.coach && g.type === "Группа"
                )
              ) {
                let idx = this.tableData.findIndex(
                  g => g.coach === c.coach && g.type === "Группа"
                );
                this.tableData[idx].count += groupL;
                this.tableData[idx].summ = this.tableData[idx].count * 2000;
              } else {
                this.tableData.push({
                  coach: c.coach,
                  count: groupL,
                  type: "Группа",
                  summ: groupL * 2000
                });
              }
            }

            if (indivL > 0) {
              if (
                this.tableData.some(
                  g => g.coach === c.coach && g.type === "Индив"
                )
              ) {
                let idx = this.tableData.findIndex(
                  g => g.coach === c.coach && g.type === "Индив"
                );
                this.tableData[idx].count += indivL;
                this.tableData[idx].summ = this.tableData[idx].count * 1500;
              } else {
                this.tableData.push({
                  coach: c.coach,
                  count: indivL,
                  type: "Индив",
                  summ: indivL * 1500
                });
              }
            }
          });
        }
      }

      this.sampleTable = this.tableData;
      this.inTotal();
      this.selectCoach();
      if (this.tableData.length > 1) {
        this.exportButton = false;
      } else {
        this.exportButton = true;
      }

      this.nameExcel = "Отчет " + new Date().format("dd.mm.yyyy");
    }
  }
};
</script>

<style></style>
