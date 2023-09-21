<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";

const infiniteScrollWrapper = ref();
const props = defineProps<{ root?; rootMargin?: string; threshold?: number }>();
const emit = defineEmits(["on-intersect"]);

const defaultOptions = {
  root: null,
  rootMargin: "400px",
  threshold: 0.0,
};

let observer = {
  observe(_target: Element) {},
  disconnect() {},
};

onMounted(() => {
  observer = new IntersectionObserver(
    ([item], _observer) => {
      if (!!item && item.isIntersecting) {
        emit("on-intersect");
      }
    },
    { ...defaultOptions, ...props }
  );
  observer.observe(infiniteScrollWrapper.value);
});

onBeforeUnmount(() => {
  observer.disconnect();
});
</script>

<template>
  <div ref="infiniteScrollWrapper">
    <slot></slot>
  </div>
</template>
