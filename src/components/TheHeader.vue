<script lang="ts" setup>
import AuthService from "@/modules/Auth/AuthService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = async () => {
  await ServiceLocator.instance.getService(AuthService).logout();
  router.push({ name: "main" });
};

const userAvatar = computed(() => {
  return ServiceLocator.instance.getService(AuthService).currentUser?.photo;
});

const userName = computed(() => {
  return ServiceLocator.instance.getService(AuthService).currentUser?.name;
});
</script>

<template>
  <v-app-bar app elevation="1" color="white">
    <v-spacer></v-spacer>
    <div class="align-center flex">
      <v-avatar :image="userAvatar" size="large" class="border-2 border-blue-500" />
      <div class="mx-2">
        {{ userName }}
      </div>
    </div>
    <v-btn class="mx-2 bg-blue-500" light color="white" @click="logout">
      <v-icon dark>mdi-exit-to-app</v-icon>
    </v-btn>
  </v-app-bar>
</template>
