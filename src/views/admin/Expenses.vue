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
                clearable
                label="Введите сумму"
                v-mask="'######'"
              ></v-text-field>
              <v-text-field
                v-model="comment"
                outlined
                dense
                clearable
                :rules="$validation.required"
                label="Комментарий"
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
        <template v-slot:item.removes="{ item }">
          <v-icon @click="(selectedItem = item), (dialogRemove = true)"
            >mdi-close</v-icon
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
    <v-row justify="center">
      <v-dialog v-model="dialogRemove" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Подтвердить удаление </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogRemove = false"
              >Отмена</v-btn
            >
            <v-btn
              color="green darken-1"
              text
              @click="
                dialogRemove = false;
                deleteExpenses(selectedItem);
                deleteExpensesLocal();
              "
              >Подтвердить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
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
      dialogRemove: false,
      comment: "",
      tableData: [],
      page: 1,
      pageCount: 1,
      selectedItem: {},
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
        },
        {
          text: "",
          value: "removes"
        }
      ],
      allExpenses: []
    };
  },
  computed: {
    ...mapGetters({
      // allExpenses: "EXPENSES"
    })
  },
  async created() {
    this.loading = true;
    this.allExpenses = await this.getExpenses();
    let isFilter = date => {
      let mDate = Math.ceil(
        Math.abs(new Date().getTime() - date * 1000) /
          (1000 * 60 * 60 * 24 * 30)
      );
      return mDate <= 6;
    };

    this.tableData = this.allExpenses.filter(c => isFilter(c.date.seconds));
    this.loading = false;
  },
  methods: {
    ...mapActions({
      sendExpenses: "SEND_EXPENSES",
      getExpenses: "GET_EXPENSES",
      deleteExpenses: "DELETE_EXPENSES"
    }),
    deleteExpensesLocal() {
      this.tableData = this.tableData.filter(
        c => c.id !== this.selectedItem.id
      );
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loadingB = true;
        const payload = {
          id: this.$g.generate(16),
          price: this.price,
          name: this.comment,
          date: new Date(),
          dateFormat: this.$moment().format("DD.MM.YYYY")
        };
        this.sendExpenses(payload);
        this.tableData.push(payload);
        setTimeout(() => {
          this.loadingB = false;
          this.dialog = false;
        }, 1000);
      }
    }
  }
};
</script>

<style></style>
