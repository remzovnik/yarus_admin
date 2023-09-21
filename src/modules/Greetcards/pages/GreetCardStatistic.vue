<script lang="ts" setup>
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import GreetCardService from "@/modules/Greetcards/GreetCardService";
import { GreetCardStatisticType } from "../models/GreetCardModel";
import BaseCalendar from "@/components/forms/BaseCalendar.vue";

const result = ref<any>(null);

const getStatistic = (statType: GreetCardStatisticType) => {
  if (statType == GreetCardStatisticType.MOST_POPULAR_CATEGORY) {
    ServiceLocator.instance.getService(GreetCardService).getMostPopularCategory();
  }
};
</script>
<template>
  <section>
    <v-card class="mx-auto mb-4" max-width="1200">
      <div class="pa-4">Выберите период:</div>
      <!--      Добавить датапикеры-->
      <BaseCalendar />
      <div class="pa-4">Выберите тип статистики:</div>
      <v-card-actions class="pb-4">
        <v-btn variant="contained-text" @click="getStatistic(GreetCardStatisticType.MOST_POPULAR_CATEGORY)"
          >Самая популярная категория</v-btn
        >
        <v-btn variant="contained-text" @click="getStatistic(GreetCardStatisticType.MOST_POPULAR_SLIDER)"
          >Самый популярный слайдер</v-btn
        >
        <v-btn variant="contained-text" @click="getStatistic(GreetCardStatisticType.MOST_POPULAR_CARD)"
          >Самое популярное изображение</v-btn
        >
        <v-btn variant="contained-text" @click="getStatistic(GreetCardStatisticType.TEXT)">Выгрузка по текстам</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="!!result">Тут будет результат! </v-card>
  </section>
</template>
