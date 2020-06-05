<template>
  <v-container>
    <div class="great_loader" v-show="loading">
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-show="!loading">
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="500">
          <v-card class="mx-auto" max-width="500" outlined>
            <v-card-title>Расходы</v-card-title>
            <v-form class="pa-6 mt-n6" ref="form">
              <v-text-field
                v-model="price"
                outlined
                :rules="$validation.required"
                dense
                label="Введите сумму"
                v-mask="'######'"
              ></v-text-field>
              <v-text-field
                v-model="comment"
                outlined
                dense
                :rules="$validation.required"
                label="Коменнтарий"
              ></v-text-field>
              <v-btn @click="submit" color="info" :loading="loadingB"
                >Добавить</v-btn
              >
            </v-form>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row>
        <v-col cols="6" lg="4" sm="6">
          <v-text-field
            v-model="searchFilter"
            label="Поиск"
            outlined
            clearable
            dense
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn outlined color="success" @click="dialog = true"
            >Добавить</v-btn
          >
        </v-col>
      </v-row>
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :page.sync="page"
        hide-default-footer
        item-key="id"
        loading-text="Загрузка... Пожалуйста подождите"
        sort-by="dateFormat"
        :sort-desc="[true, false]"
        @page-count="pageCount = $event"
        :search="searchFilter"
      >
        <template v-slot:no-data>
          <span
            >Невозможно получить данные либо таблица пуста, попробуйте обновить
            страницу</span
          >
        </template>
      </v-data-table>
      <v-btn
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
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: false,
      loadingB: false,
      price: "",
      dialog: false,
      comment: "",
      tableData: [],
      page: 1,
      pageCount: 1,
      searchFilter: "",
      tableHeaders: [
        {
          text: "Название",
          value: "name"
        },
        {
          text: "Цена",
          value: "price"
        },
        {
          text: "Дата",
          value: "dateFormat"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      allExpenses: "EXPENSES"
    })
  },
  created() {
    this.loading = true;
    this.getExpenses();
    setTimeout(() => {
      this.allExpenses.forEach(c => {
        Object.values(c).forEach(g => {
          this.tableData.push(g);
        });
      });
      this.loading = false;
    }, 1500);
  },
  methods: {
    ...mapActions({
      sendExpenses: "SEND_EXPENSES",
      getExpenses: "GET_EXPENSES"
    }),
    submit() {
      if (this.$refs.form.validate()) {
        this.loadingB = true;
        const payload = {
          id: this.$g.generate(16),
          price: this.price,
          name: this.comment,
          date: new Date(),
          dateFormat: new Date().format("dd.mm.yyyy")
        };
        this.sendExpenses(payload);
        this.tableData.push(payload);
        setTimeout(() => {
          this.loadingB = false;
          this.comment = "";
          this.price = "";
        }, 1000);
      }
    }
  }
};
</script>

<style></style>
