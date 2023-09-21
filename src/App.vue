<script setup lang="ts">
import { ref, markRaw, watch, computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
//@ts-ignore
import { ModalsContainer } from "vue-final-modal";

import BaseSimoleModal from "@/components/modal/BaseSimoleModal.vue";

const showModal = ref(false);

const route = useRoute();

const layout = computed(() => {
  return route?.name ? route.meta?.layout || DefaultLayout : false;
});
</script>

<template>
  <!-- <BaseSimoleModal :show="showModal" show-close></BaseSimoleModal>
  <button class="absolute z-[2000]" @click="showModal = !showModal">showModal</button> -->
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
  <modals-container></modals-container>
</template>
