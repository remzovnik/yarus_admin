<script setup lang="ts">
import { ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = withDefaults(defineProps<{ show: boolean; showClose: boolean; clickOutside: boolean }>(), {
  show: false,
  showClose: false,
  clickOutside: true,
});
const modal = ref(null);
const showModal = ref(false);

watch(
  () => props.show,
  (show) => (showModal.value = show)
);

onClickOutside(modal, () => {
  if (props.clickOutside) {
    closeModal();
  }
});

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <Teleport to="body">
    <div v-if="showModal" ref="modal-backdrop" class="bg-opacity/50 fixed inset-0 z-[5000] overflow-y-auto bg-black">
      <div class="flex min-h-screen items-center justify-center pt-24 text-center">
        <div
          ref="modal"
          class="relative w-1/2 overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          Awiwi

          <span
            v-if="props.showClose"
            class="modal-close-button"
            @click="
              () => {
                closeModal();
              }
            "
          ></span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-close-button {
  position: absolute;
  width: 28px;
  height: 28px;
  top: -14px;
  right: -14px;
  cursor: pointer;
  &::after {
    content: "×";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #bfc8d1;
    font-size: 30px;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}
</style>
