<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <vue-cal
        selected-date="2020-04-27"
        :time-from="7 * 60"
        :time-to="22 * 60"
        :disable-views="['years', 'year', 'month']"
        hideTitleBar
        :timeCellHeight="100"
        locale="ru"
        :minEventWidth= "30"
        style="height: 80vh"
        active-view="week"
        :events="events"
      >
      </vue-cal>
    </div>
  </v-container>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import "vue-cal/dist/i18n/ru.js";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    VueCal
  },
  data() {
    return {
      loading: false,
      events: [],
      weekDays: [
        { date: "2020-04-27", name: "Пн" },
        { date: "2020-04-28", name: "Вт" },
        { date: "2020-04-29", name: "Ср" },
        { date: "2020-04-30", name: "Чт" },
        { date: "2020-05-01", name: "Пт" },
        { date: "2020-05-02", name: "Сб" },
        { date: "2020-05-03", name: "Вс" }
      ],
      allWork: []
    };
  },
  computed: {
    ...mapGetters({
      allGroupsState: "ALLGROUPS",
      allIndivState: "ALLINDIV"
    })
  },
  created() {
    this.getAllGroups();
    this.getAllIndiv();
  },
  mounted() {
      this.loading = true;
    setTimeout(() => {
      this.allWork = this.allGroupsState;
      this.allWork = this.allWork.concat(this.allIndivState);

      this.allWork.forEach(item => {
        const t = item.time.split(":");
        const eTime = (+t[0] + 1).toString() + ":" + t[1];

        item.weekDays.forEach(c => {
          const e = {
            start: "",
            end: "",
            title: "",
            content: "",
            class: ""
          };
          const date = this.weekDays.filter(g => g.name === c)[0].date;
          e.start = date + " " + item.time;
          e.end = date + " " + eTime;
          e.title = item.coach;
          const name = item.title
            ? "Индив"
            : item.mini
            ? "Минигруппа"
            : "Группа";

          e.class =
            name === "Индив" ? "indiv" : name === "Группа" ? "group" : "mini";
            const nameIndiv = name==="Индив" ? item.name : "";
          e.content = item.typeWorkout ? item.typeWorkout : nameIndiv + "<br>" + name ;
          this.events.push(e);

          // console.log("e", e);
        });
      });
        this.loading = false;
    }, 2000);
  },
  methods: {
    ...mapActions({
      getAllGroups: "GET_ALL_GROUPS",
      getAllIndiv: "GET_ALL_INDIV"
    })
  }
};
</script>

<style>
.vuecal__event {
  cursor: pointer;
}
.group {
  border: 1px solid rebeccapurple;
}
.mini {
  border: 1px solid red;
}
.indiv {
  border: 1px solid green;
}
.vuecal__event-title {
  font-size: 0.8em;
  font-weight: bold;
  /* margin: 4px 0 4px; */
}

.vuecal__event-time {
  display: inline-block;
  font-size: 0.6em;
  margin-bottom: 5px;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event-content {
  font-style: italic;
  font-size: 0.7em;
}

.weekday-label span:not([class]){
    display: none;
}
</style>
