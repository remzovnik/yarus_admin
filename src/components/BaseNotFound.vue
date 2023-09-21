<script setup lang="ts">
defineProps<{ message?: string }>();
</script>

<template>
  <section class="absolute top-[50%] right-[50%]">
    <slot></slot>
  </section>
</template>
