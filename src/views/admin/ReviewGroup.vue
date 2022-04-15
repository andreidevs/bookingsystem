<template>
  <div>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row>
        <v-col cols="6" lg="2" sm="6">
          <v-select
            v-model="day"
            :items="daysItems"
            label="Дни недели"
            outlined
            dense
            @input="changeFilter(day)"
          ></v-select>
        </v-col>
        <v-col cols="6" lg="2" sm="6">
          <v-select
            v-model="time"
            :items="timeItems"
            label="Время"
            outlined
            dense
            @input="changeFilter(time)"
          ></v-select>
        </v-col>
        <v-col cols="6" lg="2" sm="6">
          <v-select
            v-model="coach"
            :items="coachItems"
            label="Тренер"
            outlined
            dense
            @input="changeFilter(coach)"
          ></v-select>
        </v-col>
        <v-col cols="3" sm="2" lg="3">
          <v-btn rounded color="info" @click="clearFilter"
            >Очистить фильтр</v-btn
          >
        </v-col>
        <v-col cols="6" lg="3" sm="6" class="mt-n3 sm-none">
          <v-switch v-model="dense" label="Маленькая таблица"></v-switch>
        </v-col>
      </v-row>
      <v-data-table
        :dense="dense"
        :headers="tableHeaders"
        :items="sampleGroups"
        :page.sync="page"
        hide-default-footer
        disable-sort
        item-key="id"
        :loading="loading"
        loading-text="Загрузка... Пожалуйста подождите"
        sort-by="time"
        @page-count="pageCount = $event"
        :search="searchFilter"
      >
        <template v-slot:top>
          <v-btn color="success" text dark small @click="updateTable()">
            Обновить
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            class="mr-4"
            outlined
            small
            @click="showUsers(item)"
            color="success"
            min-width="120"
            >Список учеников</v-btn
          >
        </template>
        <template v-slot:item.removes="{ item }">
          <v-icon @click="(selectedItem = item), (dialogRemoveGroup = true)"
            >mdi-close</v-icon
          >
        </template>
        <template v-slot:no-data>
          <span>
            Невозможно получить данные либо таблица пуста, попробуйте обновить
            страницу
          </span>
        </template>
      </v-data-table>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        color="success"
      ></v-pagination>
      <v-row justify="center">
        <v-dialog v-model="dialogRemoveGroup" persistent max-width="400">
          <v-card>
            <v-card-title class="headline">Подтвердить удаление</v-card-title>
            <v-card-text>
              Вы действительно хотите навсегда удалить группу
              <strong>{{ selectedItem.name }}</strong>
              <br />
              <strong style="color:red">ВНИМАНИЕ</strong>
              <br />
              <span style="color:red">
                Это приведет к удаление всех клиентов занимающихся в этой группе
              </span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogRemoveGroup = false"
                >Отмена</v-btn
              >
              <v-btn
                color="green darken-1"
                text
                @click="
                  dialogRemoveGroup = false;
                  deleteGroup(selectedItem);
                  deleteGroupLocal();
                "
                >Подтвердить</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog
          v-model="dialogShowUsers"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialogShowUsers = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ dialogUsersName }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table
              :headers="tableHeadersUsers"
              :items="sampleUsers"
              :page.sync="pageS"
              hide-default-footer
              item-key="id"
              :loading="loading"
              loading-text="Загрузка... Пожалуйста подождите"
              sort-by="time"
              @page-count="pageCountS = $event"
            >
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
                  <v-icon small v-if="!item.paid" class="ml-1"
                    >mdi-cash-usd</v-icon
                  >
                </v-btn>
              </template>
              <template v-slot:item.removes="{ item }">
                <v-icon
                  @click="(selectedItem = item), (dialogRemoveUser = true)"
                  >mdi-close</v-icon
                >
              </template>
              <template v-slot:no-data>
                <span>
                  Невозможно получить данные либо таблица пуста, попробуйте
                  обновить страницу
                </span>
              </template>
            </v-data-table>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogPay" persistent max-width="400">
          <v-card>
            <v-card-title class="headline">Подтвердить оплату</v-card-title>
            <v-card-text>
              Стоимость абонемента
              <strong>{{ selectedItem.subscription }}тг</strong> Клиент
              <strong>{{ selectedItem.name }}</strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogPay = false"
                >Отмена</v-btn
              >
              <v-btn color="green darken-1" text @click="pay"
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
              <strong> {{ selectedItem.name }}</strong> из группы
              <strong>{{ selectedItem.nameGroup }}</strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogRemoveUser = false"
                >Отмена</v-btn
              >
              <v-btn color="green darken-1" text @click="deleteUser()"
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
        <v-icon>mdi-keyboard-backspace</v-icon>Назад
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      page: 1,
      pageS: 1,
      dialogRemoveUser: false,
      tableHeadersUsers: [
        {
          text: "Имя",
          value: "name"
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
          text: "Дата оплаты",
          value: "datePay"
        },
        {
          text: "Статус",
          value: "actions"
        },
        {
          text: "",
          value: "removes"
        }
      ],
      tableHeaders: [
        {
          text: "Дни",
          value: "weekDays"
        },
        {
          text: "Время",
          value: "time"
        },
        {
          text: "Тренер",
          value: "coach"
        },
        {
          text: "Вид тренеровки",
          value: "typeWorkout"
        },
        {
          text: "Свободные места",
          value: "count"
        },
        {
          text: "Тип",
          value: "type"
        },
        {
          text: "",
          value: "action"
        },
        {
          text: "",
          value: "removes"
        }
      ],
      loading: false,
      dense: false,
      pageCount: 1,
      pageCountS: 1,
      dialogPay: false,
      dialogRemoveGroup: false,
      dialogShowUsers: false,
      sampleGroups: [],
      sampleUsers: [],
      searchFilter: "",
      dialogUsersName: "",
      selectedItem: {},
      day: "",
      time: "",
      coach: "",
      daysItems: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      timeItems: [
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
      coachItems: [],
      allGroupsState: [],
      usersByGroup: []
    };
  },
  async created() {
    this.updateTable();
    const coachlist = await this.getCoachList();
    this.coachItems = coachlist;
  },
  computed: {
    ...mapGetters({
      // allGroupsState: "ALLGROUPS",
      // usersByGroup: "USERSBYGROUP",
      coachList: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getAllGroups: "GET_ALL_GROUPS",
      deleteGroup: "DELETE_GROUP",
      getCoachList: "GET_COACH_LIST",
      getUser: "GET_USERS_BY_GROUP",
      deleteUserGroup: "DELETE_USER_GROUP",
      deleteUserMini: "DELETE_USER_MINI",
      getUserMini: "GET_USERS_BY_MINI",
      sendPayStatusGroup: "SEND_PAY_SUB",
      sendPayStatusMini: "SEND_PAY_MINI"
    }),
    async updateTable() {
      this.loading = true;
      this.sampleGroups = [];
      this.allGroupsState = await this.getAllGroups();

      this.sampleGroups = this.allGroupsState.map(
        c => (c = { ...c, type: c.mini ? "Минигруппа" : "Группа" })
      );
      this.loading = false;
    },
    deleteUserLocal() {
      this.sampleUsers = this.sampleUsers.filter(
        c => c.id !== this.selectedItem.id
      );
    },
    deleteUser() {
      this.dialogRemoveUser = false;
      if (
        this.selectedItem.nameGroup
          .trim()
          .split(" ")
          .pop() === "Минигруппа"
      ) {
        this.deleteUserMini(this.selectedItem);
      } else {
        this.deleteUserGroup(this.selectedItem);
      }
      this.deleteUserLocal();
    },
    async updateTableS() {
      this.loading = true;
      this.sampleUsers = [];
      if (!this.selectedItem.mini || this.selectedItem.mini === undefined) {
        this.usersByGroup = await this.getUser(this.selectedItem.id);
      } else {
        this.usersByGroup = await this.getUserMini(this.selectedItem.id);
      }
      this.sampleUsers = this.usersByGroup;
      this.loading = false;
    },
    showUsers(item) {
      this.selectedItem = item;
      this.dialogUsersName = item.name;
      this.dialogShowUsers = true;
      this.updateTableS();
    },
    pay() {
      this.dialogPay = false;
      if (
        this.selectedItem.nameGroup
          .trim()
          .split(" ")
          .pop() === "Минигруппа"
      ) {
        this.sendPayStatusMini(this.selectedItem);
      } else {
        this.sendPayStatusGroup(this.selectedItem);
      }
      this.updatePaidItem();
    },
    clearFilter() {
      this.searchFilter = this.coach = this.time = this.day = "";
    },
    updatePaidItem() {
      const idx = this.sampleUsers.findIndex(
        c => c.id === this.selectedItem.id
      );
      this.sampleUsers[idx].paid = true;
      this.sampleUsers[idx].datePay = this.$moment.format("DD.MM.YYYY");
      this.sampleUsers[idx].datePayNoformat = new Date();
    },
    deleteGroupLocal() {
      this.sampleGroups = this.sampleGroups.filter(
        c => c.id !== this.selectedItem.id
      );
    },
    changeFilter(item) {
      this.searchFilter = "";
      if (item === this.day) {
        this.searchFilter = this.day;
      } else if (item === this.time) {
        this.searchFilter = this.time;
      } else {
        this.searchFilter = this.coach;
      }
    }
  }
};
</script>

<style scoped></style>
