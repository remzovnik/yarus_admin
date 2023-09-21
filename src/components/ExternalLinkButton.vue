<script setup lang="ts">
const props = defineProps<{ url: string }>();
</script>

<template>
  <v-btn color="primary" icon="mdi-link-variant" size="x-small" :href="props.url" target="_blank"> </v-btn>
</template>
