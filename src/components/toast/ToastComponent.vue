<script setup lang="ts">
import { onMounted } from "vue";

const closeInterval = 4500;

const props = defineProps<{ id?: number; warning?: boolean; text?: string }>();
const emit = defineEmits<{ (e: "close", id: number | undefined): void }>();

onMounted(() => {
  setTimeout(() => {
    emit("close", props.id);
  }, closeInterval);
});
</script>

<template>
  <div
    class="vue-dialog-toast z-[20001] w-[300px] max-w-[360px] cursor-pointer opacity-100"
    :class="[warning ? 'vue-dialog-toast--warning bg-[red] text-[white]' : 'vue-dialog-toast--notify bg-[#4caf50] text-[white]']"
    @click="emit('close', props.id)"
  >
    <div class="whitespace-pre-wrap break-words p-[18px] text-14">{{ props.text }}</div>
  </div>
</template>

<style lang="scss">
.vue-dialog-toast {
  &--warning {
    border-left-style: solid !important;
    border-left-color: $red !important;
    border-left-width: 3px !important;
  }

  &--notify {
    border-left-style: solid !important;
    border-left-color: $secondary !important;
    border-left-width: 3px !important;
  }
}
</style>
