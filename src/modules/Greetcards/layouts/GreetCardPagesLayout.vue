<script setup lang="ts">
import { RouteLink } from "@/_core/models/RouteLink";

const navigation: RouteLink[] = [
  { linkName: "Общая информация", name: "greet-card-list", icon: "" },
  { linkName: "Неиспользуемые слайдеры", name: "greet-card-unused-slider-list", icon: "" },
  {
    linkName: "Статистика",
    name: "greet-card-statistic",
    icon: "",
  },
];
</script>
<template>
  <section>
    <v-card class="pa-4 mx-auto mb-4" max-width="1200">
      <v-list class="d-flex">
        <v-list-item
          v-for="(item, i) in navigation"
          :key="i"
          :active="$route.name === item.name"
          :link="true"
          :title="item.linkName"
          @click="$router.push({ name: item.name, params: { userId: 0 } })"
        ></v-list-item>
      </v-list>
    </v-card>
  </section>
  <router-view />
</template>
