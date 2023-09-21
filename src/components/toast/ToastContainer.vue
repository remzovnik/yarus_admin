<script setup lang="ts">
import { ref, watch } from "vue";
import ToastComponent from "./ToastComponent.vue";
const props = defineProps<{ toast?: any }>();

const toastItemList = ref<any[]>([]);

watch(
  () => props.toast,
  (value) => {
    if (!!value) {
      toastItemList.value.push(value);
    }
  },
  { immediate: true }
);

const closeNotify = (id: number) => {
  const index = toastItemList.value.find((iter) => iter.id === id);
  if (!!index) {
    toastItemList.value.splice(index, 1);
  }
};
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Teleport to="body">
    <div id="toast-container" class="fixed top-[1px] right-[10px] z-[2001] flex max-h-[90vh] flex-col overflow-auto">
      <ToastComponent
        v-for="(iter, index) in toastItemList"
        v-bind="iter"
        :key="index"
        class="my-[8px]"
        @close="closeNotify(iter.id)"
      ></ToastComponent>
    </div>
  </Teleport>
</template>
