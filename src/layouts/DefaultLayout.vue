<script lang="ts" setup>
import TheNavBar from "@/components/TheNavBar.vue";
import TheHeader from "@/components/TheHeader.vue";
import BaseBackToTop from "@/components/BaseBackToTop.vue";
</script>
<template>
  <TheNavBar />
  <TheHeader />
  <v-main style="height: 100vh">
    <v-container class="p-30">
      <slot></slot>
    </v-container>
  </v-main>
  <BaseBackToTop></BaseBackToTop>
</template>
