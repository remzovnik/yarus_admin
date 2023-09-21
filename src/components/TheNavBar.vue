<script lang="ts" setup>
import { RouteLink } from "@/_core/models/RouteLink";

const navigation: RouteLink[] = [
  {
    linkName: "Лента блогеров",
    name: "bloggers-feed",
    icon: "mdi-account-group",
  },
  { linkName: "Контент", name: "search-content", icon: "mdi-account" },
  {
    linkName: "Новости",
    name: "news-edit",
    icon: "mdi-newspaper",
  },
  {
    linkName: "События",
    name: "event-list",
    icon: "mdi-cannabis",
  },
  {
    linkName: "Парсеры",
    name: "parser-list",
    icon: "mdi-spider-web",
  },
  {
    linkName: "[DRAFT] Жалобы",
    name: "complaint",
    icon: "mdi-chat-question",
  },
  {
    linkName: "[DRAFT] Квесты",
    name: "quest-list",
    icon: "mdi-chat-question",
  },
  {
    linkName: "[DRAFT] Открытки",
    name: "greet-card",
    icon: "mdi-postage-stamp",
  },
];
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list class="mt-10" density="compact">
      <v-list-item
        v-for="(item, i) in navigation"
        :key="i"
        :link="true"
        :prepend-icon="item.icon"
        :title="item.linkName"
        @click="$router.push({ name: item.name, params: { userId: 0 } })"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
