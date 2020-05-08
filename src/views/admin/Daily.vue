<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-alert type="success">
        {{ new Date().format("dddd, mmmm dS, yyyy") }}
      </v-alert>
      <v-data-table
        v-model="selected"
        :headers="tableHeaders"
        :items="sampleTable"
        :page.sync="page"
        :dense="dense"
        hide-default-footer
        item-key="id"
        show-select
        :loading="loading"
        loading-text="Загрузка... Пожалуйста подождите"
        @page-count="pageCount = $event"
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
      <v-row class="d-flex">
        <v-btn class="mr-2" :loading="loadingB" outlined @click="addItem()"
          ><v-icon>mdi-plus</v-icon> Добавить</v-btn
        >
        <v-btn outlined @click="perform"
          ><v-icon>mdi-check</v-icon> Подтвердить</v-btn
        >
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Добавить проведенную тренировку</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div v-show="step === 1">
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                        v-model="selectName"
                        label="Имя клиента"
                        outlined
                        clearable
                        dense
                        @input="changeFilter(selectName)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
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
                      <v-btn rounded color="info" @click="step = 2"
                        >Нету в списке</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-data-table
                    :headers="tableHeadersSingle"
                    :items="sampleUsers"
                    :page.sync="pageSingle"
                    :items-per-page="5"
                    hide-default-footer
                    item-key="id"
                    :loading="loading"
                    loading-text="Загрузка... Пожалуйста подождите"
                    @page-count="pageCountSingle = $event"
                    :search="searchFilter"
                  >
                    <template v-slot:no-data>
                      <span
                        >Невозможно получить данные либо таблица пуста,
                        попробуйте обновить страницу</span
                      >
                    </template>
                    <template v-slot:item.action="{ item }">
                      <v-icon @click="addItemInTable(item)">mdi-check</v-icon>
                    </template>
                  </v-data-table>
                  <v-pagination
                    v-model="pageSingle"
                    :length="pageCountSingle"
                    circle
                    color="success"
                  ></v-pagination>
                  <v-row justify="center">
                    <v-dialog v-model="dialogPay" persistent max-width="290">
                      <v-card>
                        <v-card-title class="headline"
                          >Этот клиент не оплачен!</v-card-title
                        >
                        <v-card-text
                          >Хотите подтвердить оплату сейчас?</v-card-text
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="success" text @click="dialogPay = false"
                            >Нет</v-btn
                          >
                          <v-btn color="green darken-1" text @click="pay"
                            >Да</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-row>
                </div>
                <div v-show="step === 2">
                  <v-container>
                    <v-text-field
                      label="ФИО"
                      dense
                      :rules="$validation.required"
                      outlined
                      v-model="selectName"
                    ></v-text-field>
                    <v-text-field
                      dense
                      v-model="selectPhone"
                      v-mask="'+7(###)###-##-##'"
                      outlined
                      clearable
                      :rules="$validation.phone"
                      label="Телефон"
                    >
                    </v-text-field>
                    <v-btn outlined color="success" @click="addNewToItem"
                      >Добавить</v-btn
                    >
                  </v-container>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false"
                >Закрыть</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogPerform" max-width="290">
          <v-card>
            <v-card-title class="headline"></v-card-title>

            <v-card-text>
              Количество тренеровок сегодня: {{ countTr }} <br />
              Заработанно: {{ earned }}
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="success"
                text
                @click="(dialogPerform = false), $router.push('/admin')"
              >
                Ок
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-btn
        class="sm-none"
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
      earned: 0,
      countTr: 0,
      page: 1,
      step: 1,
      pageSingle: 1,
      dense: false,
      dialog: false,
      dialogPay: false,
      selected: [],
      days: ["Вc", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      tableHeaders: [
        {
          text: "Тип занятия",
          value: "typeW"
        },
        {
          text: "Дни",
          value: "weekDays"
        },
        {
          text: "Имя ученика (Название группы)",
          value: "name"
        },
        {
          text: "Время",
          value: "time"
        },
        {
          text: "Тренер",
          value: "coach"
        }
      ],
      loading: false,
      loadingB: false,

      pageCount: 1,
      sampleUsers: [],
      searchFilter: "",
      pageCountSingle: 1,
      tableHeadersSingle: [
        {
          text: "Имя",
          value: "name"
        },
        {
          text: "Телефон",
          value: "phone"
        },
        {
          text: "Статус оплаты",
          value: "status"
        },

        {
          text: "",
          value: "action"
        }
      ],
      sampleTable: [],
      selectName: "",
      selectPhone: "",
      selectedItem: {},
      dialogPerform: false
    };
  },
  created() {
    this.updateTable();
  },
  computed: {
    ...mapGetters({
      allGroupsState: "ALLGROUPS",
      allIndivState: "ALLINDIV",
      coachName: "USER"
    })
  },
  methods: {
    ...mapActions({
      getAllGroups: "GET_ALL_GROUPS",
      getAllIndiv: "GET_ALL_INDIV",
      setPayStatus: "SEND_PAY_INDIV",
      sendReport: "SEND_DAILY"
    }),
    updateTable() {
      this.loading = true;
      this.sampleTable = [];
      this.getAllGroups();
      setTimeout(() => {
        this.sampleTable = this.allGroupsState
          .filter(
            c =>
              c.coach == this.coachName.name &&
              c.weekDays.includes(this.days[new Date().getDay()])
          )
          .map(c => (c = { ...c, typeW: "Группа" }))
          .concat(
            this.allIndivState
              .filter(
                c =>
                  c.coach == this.coachName.name &&
                  c.weekDays.includes(this.days[new Date().getDay()])
              )
              .map(c => (c = { ...c, typeW: "Индив" }))
          );
        this.loading = false;
      }, 2000);
    },
    addItem() {
      this.loadingB = true;
      this.clearFilter();
      this.step = 1;
      this.getAllIndiv();
      setTimeout(() => {
        this.sampleUsers = this.allIndivState.map(
          c => (c = { ...c, status: c.paid ? "Оплачен" : "Не оплачен" })
        );
        this.dialog = true;
        this.loadingB = false;
      }, 1000);
    },
    pay() {
      this.loading = true;
      this.setPayStatus(this.selectedItem);
      this.updatePaidItem();
      this.sampleUsers = this.sampleUsers.map(
        c => (c = { ...c, status: c.paid ? "Оплачен" : "Не оплачен" })
      );
      this.dialogPay = false;
      this.loading = false;
    },
    updatePaidItem() {
      const idx = this.sampleUsers.findIndex(
        c => c.id === this.selectedItem.id
      );
      this.sampleUsers[idx].paid = true;
    },
    addNewToItem() {
      const item = {
        name: this.selectName,
        phone: this.selectPhone,
        coach: this.coachName.name,
        paid: true,
        datePay: new Date().format("dd.mm.yyyy"),
        datePayNoformat: new Date(),
        subscription: "3000",
        typeW: "Индив"
      };
      this.sampleTable.push(item);

      this.dialog = false;
    },
    addItemInTable(item) {
      this.selectedItem = item;
      if (item.paid) {
        item = { ...item, typeW: "Индив" };
        if (this.sampleTable.some(c => item.id === c.id)) {
          this.$notify({
            group: "app",
            type: "info",
            title: "Вы уже добавели данную тренировку!"
          });
        } else {
          this.sampleTable.push(item);
          this.dialog = false;
        }
      } else {
        this.dialogPay = true;
      }
    },
    perform() {
      if (this.selected.length) {
        this.loading = true;
        const nd = "day-" + new Date().getDate();
        // const nd = "day-1";
        const report = {
          [nd]: {
            indiv: this.selected.filter(c => c.title),
            group: this.selected.filter(c => !c.title),
            date: new Date()
          }
        };

        this.sendReport(report);
        this.countTr = this.selected.length;
        this.earned = 0;
        this.selected.forEach(c => {
          this.earned += c.typeW === "Группа" ? 2000 : 1500;
        });
        this.dialogPerform = true;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } else {
        this.$notify({
          group: "app",
          type: "error",
          title: "Ошибка",
          text: "Выберите хотя бы одну тренировку!"
        });
      }
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
