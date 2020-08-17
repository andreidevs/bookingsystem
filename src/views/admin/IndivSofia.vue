<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <div v-show="step === 1">
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
            <v-btn
              rounded
              color="info"
              @click="
                step = 2;
                getCoachList();
              "
              >Добавить</v-btn
            >
          </v-col>
          <v-col cols="6" class="mt-n3 sm-none" lg="3" sm="6">
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
      </div>
      <div v-show="step === 2">
        <v-card
          :loading="loading"
          style=""
          class="mx-auto"
          max-width="600"
          shaped
        >
          <v-form class="pa-4" ref="formIndiv">
            <v-text-field
              label="ФИО"
              dense
              clearable
              :rules="$validation.required"
              outlined
              v-model="name"
            ></v-text-field>
            <v-text-field
              dense
              v-model="phone"
              v-mask="'+7(###)###-##-##'"
              outlined
              clearable
              :rules="$validation.phone"
              label="Телефон"
            >
            </v-text-field>
            <v-select
              v-model="nameCoach"
              :rules="$validation.required"
              dense
              label="Тренер"
              outlined
              :items="coachList"
            ></v-select>
            <v-card-subtitle class="body-1 mb-n3"
              ><v-icon>mdi-calendar-today</v-icon> Дни недели</v-card-subtitle
            >
            <v-chip-group multiple>
              <v-chip
                v-for="item in chip"
                :key="item.title"
                class="ma-2"
                :color="item.active ? 'success' : ''"
                :text-color="item.active ? 'white' : 'black'"
                @click="addWeekday(item)"
              >
                {{ item.title }}
              </v-chip>
            </v-chip-group>
            <v-card-subtitle class="body-1 mb-n4">
              <v-icon>mdi-clock</v-icon> Время тренеровки</v-card-subtitle
            >
            <v-row class="ml-2 mt-2">
              <v-col cols="6">
                <v-select v-model="timeHour" :items="timehours" label="Часы">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="timeMinute"
                  :items="timeminuts"
                  label="Минуты"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-checkbox
              v-model="statusPaid"
              label="Оплачен"
              class="mt-n2"
            ></v-checkbox>
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
          <v-card-actions class="d-flex justify-space-between">
            <v-btn color="secondary" style="" @click="step = 1"
              ><v-icon class="ml-1">mdi-arrow-left</v-icon>Назад</v-btn
            >
            <v-btn :loading="loading" color="success" @click="step2()"
              >Добавить <v-icon>mdi-checkbox-marked-circle</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </div>

      <v-row justify="center">
        <v-dialog v-model="dialogPay" persistent max-width="400">
          <v-card>
            <v-card-title class="headline">Подтвердить оплату </v-card-title>
            <v-card-text
              >Стоимость
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
              <strong> {{ selectedItem.name }}</strong>
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
      step: 1,
      priceIndiv: "",
      chip: [
        { title: "Пн", active: false, color: "red" },
        { title: "Вт", active: false, color: "purple" },
        { title: "Ср", active: false, color: "teal accent-3" },
        { title: "Чт", active: false, color: "light-green accent-3" },
        { title: "Пт", active: false, color: "pink darken-1" },
        { title: "Сб", active: false, color: "blue" },
        { title: "Вс", active: false, color: "yellow darken-1" }
      ],
      timehours: [
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21"
      ],
      timeminuts: ["00", "30"],
      timeHour: "07",
      timeMinute: "00",
      searchTable1: "",
      radioGroup: "1500",
      priceIndivGroup: "3000",
      radioItemsIndiv: [
        { text: "Цена - 3000", value: "3000" },
        { text: "Другая цена" }
      ],
      nameCoach: "",
      tableHeaders: [
        {
          text: "Название",
          value: "title"
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
          text: "Дата регистрации",
          value: "dateRegg"
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
      phone: "",
      name: "",
      searchFilter: "",
      sampleUsers: [],
      statusPaid: false,

      selectedItem: {},
      dialogPay: false,
      dialogRemoveUser: false
    };
  },
  created() {
    this.updateTable();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters({
      allIndivState: "INDIVSOFIA",
      coachList: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getAllIndiv: "GET_SOFIA_INDIV",
      getCoachList: "GET_COACH_LIST",
      setPayStatus: "SEND_PAY_SOFIA_INDIV",
      deleteUser: "DELETE_USER_SOFIA_INDIV",
      writeIndivUser: "WRITE_USER_SOFIA_INDIV"
    }),
    step2() {
      if (this.$refs.formIndiv.validate()) {
        this.loading = true;
        let payload = {
          id: this.$g.generate(24),
          dateReg: new Date(),
          title: "",
          name: this.name,
          phone: this.phone,
          subscription:
            this.priceIndivGroup === "3000" ? "3000" : this.priceIndiv,
          coach: this.nameCoach,
          paid: this.statusPaid ? true : false,
          datePay: this.statusPaid ? this.$moment().format("DD.MM.YYYY") : "",
          datePayNoformat: this.statusPaid ? new Date() : "",
          weekDays: [],
          time: this.timeHour + ":" + this.timeMinute
        };
        payload.weekDays = this.chip.filter(c => c.active).map(c => c.title);

        let days = "";
        payload.weekDays.forEach(item => {
          days += item + ", ";
        });
        payload.title = `${payload.name} ${days} ${payload.time} ${payload.coach}`;
        this.writeIndivUser(payload);
        setTimeout(() => {
          if (this.statusPaid) {
            this.setPayStatus(payload);
          }
        }, 1000);
        setTimeout(() => {
          this.loading = false;
          this.step = 1;
        }, 2000);
      }
    },
    addWeekday(chip) {
      this.chip.map(c =>
        c.title == chip.title ? (c.active = !c.active) : c.active
      );
    },
    updateTable() {
      this.loading = true;
      this.step = 1;
      this.sampleUsers = [];
      this.getAllIndiv();
      setTimeout(() => {
        this.sampleUsers = this.allIndivState.map(
          c =>
            (c = {
              ...c,
              dateRegg:
                c.dateReg != undefined
                  ? this.$moment(c.dateReg.seconds * 1000).format("DD.MM.YYYY")
                  : this.$moment().format("DD.MM.YYYY")
            })
        );
        this.loading = false;
      }, 1500);
    },
    clearFilter() {
      this.selectPhone = "";
      this.selectName = "";

      this.searchFilter = "";
    },
    updatePaidItem() {
      const idx = this.sampleUsers.findIndex(
        c => c.id === this.selectedItem.id
      );
      this.sampleUsers[idx].paid = true;
      this.sampleUsers[idx].datePay = this.$moment().format("DD.MM.YYYY");
      this.sampleUsers[idx].datePayNoformat = new Date();
    },
    deleteUserLocal() {
      this.sampleUsers = this.sampleUsers.filter(
        c => c.id !== this.selectedItem.id
      );
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
