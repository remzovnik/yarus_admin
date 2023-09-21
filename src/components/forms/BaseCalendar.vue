<script lang="ts" setup>
import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";
import { ref, computed, WritableComputedRef, defineAsyncComponent, DefineComponent } from "vue";

const Datepicker = defineAsyncComponent<DefineComponent>(() => import("@vuepic/vue-datepicker") as any);
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<template>
  <Datepicker ref="Calendar" locale="ru" range v-bind="$attrs" />
</template>
