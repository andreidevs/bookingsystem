<template>
    <v-container>
        <div class="great_loader" v-show="loadingCard">
            <v-progress-circular indeterminate color="accent" :size="100" />
        </div>
        <div v-show="!loadingCard">
            <v-card
                loading="loadingCard"
                class="mx-auto"
                max-width="500"
                outlined
            >
                <v-row>
                    <v-col cols="12" class="ml-4">
                        <v-card-title class="mb-2"
                            >Добавление группы</v-card-title
                        >
                        <v-card-subtitle class="body-1 mb-n3"
                            ><v-icon>mdi-calendar-today</v-icon> Дни
                            недели</v-card-subtitle
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
                            <v-icon>mdi-clock</v-icon> Время
                            тренеровки</v-card-subtitle
                        >
                        <v-row class="ml-2 mt-2">
                            <v-col cols="4">
                                <v-select
                                    v-model="timeHour"
                                    :items="timehours"
                                    label="Часы"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="4">
                                <v-select
                                    v-model="timeMinute"
                                    :items="timeminuts"
                                    label="Минуты"
                                >
                                </v-select>
                            </v-col>
                        </v-row>
                        <v-col cols="6" class="mt-n6">
                            <v-select
                                v-model="selectCoach"
                                :items="coachList"
                                label="Тренер"
                                prepend-icon="mdi-account"
                            ></v-select>
                        </v-col>
                        <v-col cols="6" class="mt-n6">
                            <v-select
                                v-model="selectTypeWorkout"
                                :items="typeWorkoutList"
                                label="Вид тренеровки"
                                prepend-icon="mdi-alpha-t-box"
                            ></v-select>
                            <v-checkbox
                                label="Минигруппа"
                                v-model="miniGroup"
                            ></v-checkbox>
                        </v-col>
                    </v-col>
                </v-row>
                <v-card-actions class="ml-6 mt-n6 mb-2">
                    <v-btn
                        color="success"
                        @click="createGroup"
                        depressed
                        outlined
                        class="pl-8 pr-8"
                        >Добавить</v-btn
                    >
                </v-card-actions>
                <v-row justify="center">
                    <v-dialog v-model="dialogCheck" persistent max-width="280">
                        <v-card>
                            <v-card-title class="headline"
                                >Данная группа уже существует!</v-card-title
                            >
                            <v-card-text
                                >Измените параметры и поворите
                                попытку</v-card-text
                            >
                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="dialogCheck = false"
                                    >Ок</v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
                <v-btn
                    style="
                        position: fixed !important;
                        bottom: 10px;
                        left: 10px;
                        z-index: 1000;
                    "
                    @click="$router.go(-1)"
                >
                    <v-icon>mdi-keyboard-backspace</v-icon>
                    Назад
                </v-btn>
            </v-card>
        </div>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data: () => ({
        drawer: false,
        loadingCard: false,
        coach: {
            name: "",
        },
        typeWorkout: "",
        selectCoach: "",
        selectTypeWorkout: "",
        coachList: [],
        dialogCheck: "",
        typeWorkoutList: [],
        chip: [
            { title: "Пн", active: false, color: "red" },
            { title: "Вт", active: false, color: "purple" },
            { title: "Ср", active: false, color: "teal accent-3" },
            { title: "Чт", active: false, color: "light-green accent-3" },
            { title: "Пт", active: false, color: "pink darken-1" },
            { title: "Сб", active: false, color: "blue" },
            { title: "Вс", active: false, color: "yellow darken-1" },
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
            "21",
        ],
        timeminuts: ["00", "30"],
        timeHour: "07",
        timeMinute: "00",
        time: null,
        miniGroup: false,
    }),
    computed: {
        ...mapGetters({
            coachLists: "COACH",
            typeWorkoutLists: "TYPEWORKOUT",
            check: "CHECK",
        }),
    },
    async created() {
        this.typeWorkoutList = await this.getTypeWorkoutList();
        this.coachList = await this.getCoachList();
    },
    methods: {
        ...mapActions({
            getCoachList: "GET_COACH_LIST",
            getTypeWorkoutList: "GET_TYPEWORKOUT_LIST",
            createGrooup: "CREATE_GROUP",
            checkGroup: "CHECK_GROUP",
        }),
        addWeekday(chip) {
            this.chip.map((c) =>
                c.title == chip.title ? (c.active = !c.active) : c.active
            );
        },
        createGroup() {
            this.loadingCard = true;
            let massData = {
                id: this.$g.generate(24),
                weekDays: [],
                time: "",
                coach: "",
                name: "",
                typeWorkout: "",
                count: this.miniGroup ? 5 : 10,
                users: [],
                mini: this.miniGroup,
            };
            massData.weekDays = this.chip
                .filter((c) => c.active)
                .map((c) => c.title);
            massData.time = this.timeHour + ":" + this.timeMinute;
            massData.coach = this.selectCoach;
            let days = "";
            massData.weekDays.forEach((item) => {
                days += item + ", ";
            });
            if (this.miniGroup) {
                massData.name = `${days} ${massData.time} ${massData.coach} Минигруппа`;
            } else {
                massData.name = `${days} ${massData.time} ${massData.coach}`;
            }

            massData.typeWorkout = this.selectTypeWorkout;
            if (
                massData.weekDays.length == 0 ||
                massData.time == "" ||
                massData.coach == "" ||
                massData.typeWorkout == ""
            ) {
                this.$notify({
                    group: "app",
                    type: "error",
                    title: "Ошибка",
                    text: "Проверьте заполнены ли все поля",
                });
            } else {
                this.checkGroup(massData);
                setTimeout(() => {
                    if (this.check) {
                        this.dialogCheck = true;
                    } else {
                        this.createGrooup(massData);
                    }
                }, 1000);
            }
            setTimeout(() => {
                this.loadingCard = false;
            }, 2000);
        },
    },
};
</script>

<style scoped></style>
