<script lang="ts" setup>
const props = withDefaults(defineProps<{ showClose?: boolean }>(), { showClose: true });
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <vue-final-modal
    v-slot="{ close }"
    v-bind="$attrs"
    classes="relative flex justify-center items-center"
    content-class="relative flex flex-col max-h-[90vh] mx-[4px] p-[18px] border rounded bg-white max-w-[1400px]"
    :z-index-base="2000"
  >
    <div class="grow overflow-y-auto">
      <slot :attrs="$attrs" :close="close"></slot>
    </div>
    <span
      v-if="props.showClose"
      class="modal-close-button"
      @click="
        () => {
          close();
        }
      "
    ></span>
  </vue-final-modal>
</template>

<style lang="scss">
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
