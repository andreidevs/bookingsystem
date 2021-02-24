<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-text-field
        label="ФИО"
        dense
        clearable
        outlined
        v-model="name"
      ></v-text-field>
      <!-- <v-text-field
        dense
        v-model="phone"
        v-mask="'+7(###)###-##-##'"
        outlined
        clearable
        label="Телефон"
      >
      </v-text-field> -->
      <v-select
        v-model="nameCoach"
        dense
        label="Тренер"
        outlined
        :items="coachList"
      ></v-select>
      <v-select
        v-model="group"
        dense
        clearable
        label="Группа"
        outlined
        :items="groupList"
      ></v-select>
      <v-select
        v-model="price"
        dense
        clearable
        label="Цена"
        outlined
        :items="priceList"
      ></v-select>
      <v-select
        v-model="type"
        dense
        clearable
        label="Тип"
        outlined
        :items="typeList"
      ></v-select>

      <v-date-picker
        v-model="date"
        locale="ru"
        show-current
        type="date"
      ></v-date-picker>
      <v-btn outlined @click="send">Отправить</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: true,
      name: "",
      phone: "",
      nameCoach: "",
      group: "",
      price: "",
      type: "",
      date: "",
      priceList: ["1500", "2000", "3000", "10000", "11000", "12000", "13000"],
      typeList: ["indiv", "mini", "group", "single"],
      coachList: [],
      groupList: []
    };
  },
  created() {
    this.loading = true;
    this.getGroups();
    this.getCoachList();
    this.coachList = this.coachLists;

    setTimeout(() => {
      this.groupList = this.allGroups.map(c => c.name);
      this.loading = false;
    }, 1500);
  },
  computed: {
    ...mapGetters({
      allGroups: "ALLGROUPS",
      coachLists: "COACH"
    })
  },
  methods: {
    ...mapActions({
      getGroups: "GET_ALL_GROUPS",
      getCoachList: "GET_COACH_LIST",
      sendReport: "SEND_PAY_REPORT"
    }),

    send() {
      let pay;
      if (this.type !== "indiv") {
        pay = {
          name: this.name,
          coach: this.nameCoach,
          type: this.type,
          nameGroup: this.group,
          date: new Date(this.date),
          price: this.price
        };
      } else {
        pay = {
          name: this.name,
          coach: this.nameCoach,
          type: this.type,
          date: new Date(this.date),
          price: this.price
        };
      }
      this.sendReport(pay);
    }
  }
};
</script>

<style></style>
