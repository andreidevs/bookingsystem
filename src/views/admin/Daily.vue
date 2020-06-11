<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <div v-show="mainStep === 2">
        <v-card style="margin-top: 5%" class="mx-auto" max-width="800" shaped>
          <v-row class="pa-12">
            <v-col cols="12" sm="12" lg="6"
              ><span class="headline"
                ><span v-show="yesterday">Вчера</span>
                <span v-show="!yesterday">Сегодня </span> отчет уже был
                создан</span
              ></v-col
            >
            <v-col cols="12" sm="12" lg="3"
              ><v-btn color="success" outlined dense @click="mainStep = 1"
                >Создать еще раз</v-btn
              ></v-col
            >
            <v-col cols="12" sm="12" lg="3"
              ><v-btn color="info" outlined dense @click="dialogPreview = true"
                >Вернуться назад</v-btn
              ></v-col
            >
          </v-row>
        </v-card>
      </div>
      <div v-show="mainStep === 1">
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
        <v-row>
          <v-col cols="12" sm="12" lg="6">
            <v-btn
              color="info"
              class="mr-2"
              :loading="loadingB"
              style="width: 100%"
              outlined
              @click="addItem()"
              ><v-icon>mdi-plus</v-icon> Добавить тренировку</v-btn
            >
          </v-col>
          <v-col cols="12" sm="12" lg="6">
            <v-btn style="width: 100%" color="success" @click="perform"
              ><v-icon>mdi-check</v-icon> Подтвердить</v-btn
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">Добавить проведенную тренировку</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <div v-show="step === 1">
                    <v-switch
                      v-model="switch1"
                      @change="changeSwitch"
                      label="Группы/Индивы"
                    ></v-switch>
                    <v-row>
                      <v-col :lg="!switch1 ? 4 : 6" cols="12" sm="12">
                        <v-text-field
                          v-model="selectName"
                          :label="!switch1 ? 'Имя клиента' : 'Название группы'"
                          outlined
                          clearable
                          dense
                          @input="changeFilter(selectName)"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="!switch1" cols="12" sm="12" lg="4">
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
                      <v-col v-if="!switch1" cols="12" sm="12" lg="3">
                        <v-btn rounded color="info" @click="step = 2"
                          >Нет в списке</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-data-table
                      :headers="
                        !switch1 ? tableHeadersSingle : tableHeadersSingleGroup
                      "
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
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false"
                        >Закрыть</v-btn
                      >
                    </v-card-actions>
                    <v-row justify="center">
                      <v-dialog v-model="dialogPay" persistent max-width="330">
                        <v-card>
                          <v-card-title class="headline"
                            >Этот клиент не оплачен!</v-card-title
                          >
                          <v-card-text
                            >Хотите подтвердить оплату сейчас?</v-card-text
                          >
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="success"
                              text
                              @click="dialogPay = false"
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
                      <v-form ref="form_indiv">
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
                        <v-radio-group v-model="priceIndivGroup" class="mt-n3">
                          <v-radio
                            color="success"
                            v-for="item in radioItemsIndiv"
                            :key="item.text"
                            :label="item.text"
                            :value="item.value"
                          ></v-radio>
                        </v-radio-group>
                        <v-text-field
                          v-show="priceIndivGroup !== '3000'"
                          :disabled="priceIndivGroup === '3000'"
                          v-model="priceIndiv"
                          label="Другая цена"
                          outlined
                          dense
                          v-mask="'######'"
                        ></v-text-field>
                      </v-form>
                      <v-btn outlined color="success" @click="addNewToItem"
                        >Добавить</v-btn
                      >
                    </v-container>
                  </div>
                </v-container>
              </v-card-text>
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
        <v-row justify="center">
          <v-dialog v-model="dialogPreview" persistent max-width="230">
            <v-card>
              <!-- <v-card-title class="headline"
                >Заполнить</v-card-title
              > -->
              <v-card-actions class="text-center">
                <v-btn color="success" text @click="previewYesterday(false)"
                  >За сегодня</v-btn
                >
                <v-btn color="info" text @click="previewYesterday(true)"
                  >За вчера</v-btn
                >
              </v-card-actions>
              <v-card-text v-if="USER.admin">
                <v-checkbox
                  class="mt-n1 mb-n2"
                  v-model="anotherCoach"
                  label="За другого тренера"
                ></v-checkbox>
                <v-select
                  v-show="anotherCoach"
                  v-model="nameCoach"
                  dense
                  outlined
                  :items="coachList"
                ></v-select>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      </div>
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
      switch1: true,
      page: 1,
      step: 1,
      mainStep: 1,
      pageSingle: 1,
      priceIndivGroup: "3000",
      priceIndiv: "",
      radioItemsIndiv: [
        { text: "Цена - 3000", value: "3000" },
        { text: "Другая цена" }
      ],
      dense: false,
      dialog: false,
      dialogPay: false,
      selected: [],
      days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
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
      tableHeadersSingleGroup: [
        {
          text: "Название группы",
          value: "name"
        },
        {
          text: "Тренер",
          value: "coach"
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
      date: null,
      check: false,
      nameCoach: "",
      coachList: [],
      anotherCoach: false,
      dialogPerform: false,
      yesterday: false,
      dialogPreview: true
    };
  },
  created() {
    // this.updateTable();
    this.getCoachList();
    this.coachList = this.coachLists;
  },
  computed: {
    ...mapGetters({
      allGroupsState: "ALLGROUPS",
      allIndivState: "ALLINDIV",
      coachLists: "COACH",
      USER: "USER",
      checkD: "CHECK"
    })
  },
  methods: {
    ...mapActions({
      getAllGroups: "GET_ALL_GROUPS",
      getAllIndiv: "GET_ALL_INDIV",
      setPayStatus: "SEND_PAY_INDIV",
      sendReport: "SEND_DAILY",
      sendPayReport: "SEND_PAY_REPORT",
      getCoachList: "GET_COACH_LIST",
      checkDaily: "CHECK_DAILY"
    }),
    previewYesterday(value) {
      this.yesterday = value;
      this.updateTable();
      if (!this.anotherCoach || this.nameCoach === "") {
        this.nameCoach = this.USER.name;
      }
      let day;
      if (this.yesterday) {
        day = parseInt(new Date().getDate() - 1);
      } else {
        day = new Date().getDate();
      }
      const payload = {
        coach: this.nameCoach,
        day: day,
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      };
      this.checkDaily(payload);

      setTimeout(() => {
        if (this.checkD) {
          this.mainStep = 2;
        } else {
          this.mainStep = 1;
        }
      }, 1000);
      this.dialogPreview = false;
    },

    updateTable() {
      this.loading = true;
      this.sampleTable = [];
      this.getAllGroups(true);
      this.getAllIndiv();
      let filter = "";
      if (this.yesterday) {
        filter = parseInt(new Date().getDay() - 1);
      } else {
        filter = new Date().getDay();
      }
      setTimeout(() => {
        this.sampleTable = this.allGroupsState

          .filter(
            c =>
              c.coach == this.nameCoach &&
              c.weekDays.includes(this.days[filter])
          )
          .map(c => (c = { ...c, typeW: "Группа" }))
          .concat(
            this.allIndivState
              .filter(
                c =>
                  c.coach == this.nameCoach &&
                  c.weekDays.includes(this.days[filter])
              )
              .map(c => (c = { ...c, typeW: "Индив" }))
          );
        this.loading = false;
      }, 1000);
    },
    addItem() {
      this.loadingB = true;
      this.clearFilter();
      this.step = 1;
      this.getAllIndiv();
      this.sampleUsers = this.allGroupsState;
      this.dialog = true;
      this.loadingB = false;
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
      if (this.$refs.form_indiv.validate()) {
        const item = {
          name: this.selectName,
          phone: this.selectPhone,
          coach: this.nameCoach,
          paid: false,
          datePay: new Date().format("dd.mm.yyyy"),
          datePayNoformat: new Date(),
          subscription:
            this.priceIndivGroup === "3000" ? "3000" : this.priceIndiv,
          typeW: "Индив",
          title: this.nameCoach + "Индив"
        };
        this.sendPayReport({
          name: item.name,
          coach: item.coach,
          type: "indiv",
          date: new Date(),
          price: item.subscription
        });
        this.sampleTable.push(item);

        this.dialog = false;
      }
    },
    addItemInTable(item) {
      this.selectedItem = item;

      if (this.sampleTable.some(c => item.id === c.id)) {
        this.$notify({
          group: "app",
          type: "info",
          title: "Вы уже добавели данную тренировку!"
        });
      } else {
        if (item.typeWorkout) {
          item = { ...item, typeW: "Группа" };
          this.sampleTable.push(item);
          this.dialog = false;
        } else {
          if (item.paid) {
            item = { ...item, typeW: "Индив" };
            this.sampleTable.push(item);
            this.dialog = false;
          } else {
            this.dialogPay = true;
          }
        }
      }
    },
    changeSwitch() {
      if (this.switch1) {
        this.sampleUsers = this.allGroupsState;
      } else {
        this.sampleUsers = this.allIndivState.map(
          c => (c = { ...c, status: c.paid ? "Оплачен" : "Не оплачен" })
        );
      }
    },
    perform() {
      if (this.selected.length) {
        this.loading = true;
        let nd = "";
        const dayMilliseconds = 24 * 60 * 60 * 1000;
        let currentDate = new Date();

        if (this.yesterday) {
          nd = new Date().getDate() - 1;
          currentDate.setTime(currentDate.getTime() - dayMilliseconds);
        } else {
          nd = parseInt(new Date().getDate());
          currentDate = new Date();
        }

        const report = {
          indiv: this.selected.filter(c => c.title),
          group: this.selected.filter(c => !c.title),
          date: currentDate,
          day: nd,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          coach: this.nameCoach
        };

        this.sendReport(report);
        this.countTr = this.selected.length;
        this.earned = 0;
        this.selected.forEach(c => {
          this.earned +=
            c.typeW === "Группа" || c.typeW === "Минигруппа" ? 2000 : 1500;
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
