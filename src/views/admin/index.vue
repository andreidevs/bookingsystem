<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/daily')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-7">
              <v-icon style="font-size: 64px" color="white"
                >mdi-table-edit</v-icon
              >
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Ежедневный отчет</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          max-height="145"
          shaped
          color="success"
        >
          <v-list-item-content>
            <div class="d-flex pa-2">
              <v-icon style="font-size: 64px" color="white">mdi-account</v-icon>
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Ученики</v-card-title
              >
            </div>
            <v-card-actions class="mt-n3 ml-n1">
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/users/group')"
                >Групп</v-btn
              >
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/users/mini')"
                >Минигрупп</v-btn
              >
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/users/indiv')"
                >Индив</v-btn
              >
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/users/single')"
                >Разовые</v-btn
              >
            </v-card-actions>
          </v-list-item-content>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          max-height="145"
          shaped
          color="success"
        >
          <v-list-item-content>
            <div class="d-flex pa-2">
              <v-icon style="font-size: 64px" color="white">mdi-plus</v-icon>
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Добавить</v-card-title
              >
            </div>
            <v-card-actions class="mt-n3 ml-4">
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/addclient')"
                >Клиента</v-btn
              >
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/addgroup')"
                >Группу</v-btn
              >
              <v-btn
                small
                outlined
                color="white"
                @click="$router.push('/anotherpay')"
                >Другая оплата</v-btn
              >
            </v-card-actions>
          </v-list-item-content>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/schedule')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-7">
              <v-icon style="font-size: 64px" color="white"
                >mdi-calendar</v-icon
              >
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Расписание</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/groups')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-7">
              <v-icon style="font-size: 64px" color="white"
                >mdi-folder-account</v-icon
              >
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Список групп</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          max-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/historysingle')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-n4">
              <v-icon style="font-size: 64px" color="white">mdi-run</v-icon>
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >История разовых <br />
                занятий</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="admin">
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          max-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/statistic')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-6">
              <v-icon style="font-size: 64px" color="white"
                >mdi-chart-areaspline</v-icon
              >
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Статистика</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          max-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/wages')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-n4">
              <v-icon style="font-size: 64px" color="white"
                >mdi-currency-rub</v-icon
              >
              <v-card-title
                class=" headline font-weight-light mb-1"
                style="color: white"
                >Расчет заработной <br />
                платы</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" sm="12">
        <v-card
          class="mx-auto"
          max-width="345"
          min-height="145"
          max-height="145"
          shaped
          color="success"
        >
          <v-list-item-content
            style="cursor: pointer;"
            @click="$router.push('/expenses')"
          >
            <div class="d-flex pa-2 align-center justify-center pt-6">
              <v-icon style="font-size: 64px" color="white"
                >mdi-cash-multiple</v-icon
              >
              <v-card-title
                class="headline font-weight-light mb-1 ml-n1"
                style="color: white"
                >Расходы</v-card-title
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { eventBus } from "../../main";
export default {
  data() {
    return {
      admin: false
    };
  },
  created() {
    eventBus.$on("useradmin", data => {
      this.admin = data;
    });
  }
};
</script>

<style scoped>
.card {
  display: flex;
}
</style>
