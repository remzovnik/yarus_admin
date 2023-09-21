<script lang="ts" setup>
import BaseModal from "@/components/modal/BaseModal.vue";

const props = withDefaults(defineProps<{ showButtons?: boolean; title?: string; text?: string; resolve?: any }>(), {
  showButtons: true,
});
</script>

<template>
  <BaseModal v-slot="slotProps">
    <span v-if="!!props.title" class="mr-[8px] font-semibold">
      {{ title }}
    </span>
    <div v-if="!!props.text" :class="[!!props.title ? 'mt-[16px]' : '', 'grow', 'overflow-y-auto']">
      {{ text }}
    </div>

    <div v-if="props.showButtons" class="flex shrink-0 items-center justify-center pt-[32px]">
      <v-btn
        variant="outlined"
        color="primary"
        @click="
          () => {
            if (slotProps.close) {
              slotProps.close();
            }
            if (!!props.resolve) {
              props.resolve(true);
            }
          }
        "
        >OK</v-btn
      >
      <v-btn
        class="ml-[32px]"
        variant="outlined"
        @click="
          () => {
            slotProps.close();
            if (!!props.resolve) {
              props.resolve(false);
            }
          }
        "
        >Отмена</v-btn
      >
    </div>
  </BaseModal>
</template>
