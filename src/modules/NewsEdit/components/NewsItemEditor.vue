<script setup lang="ts">
import UploadImage from "@/components/forms/UploadImage.vue";
import { computed } from "vue";
import BaseInput from "@/components/forms/BaseInput.vue";

const props = defineProps<{ type; label; value; actions }>();

const textField = computed(() => {
  return [0, 4].includes(props.type);
});

const textArea = computed(() => {
  return [1, 3].includes(props.type);
});

const image = computed(() => {
  return props.type === 2;
});

const emit = defineEmits(["itemAction", "itemChange"]);

const actionIcon = (action) => {
  let icon;

  switch (action) {
    case 1:
      icon = "delete";
      break;
    case 2:
      icon = "credit-card-plus-outline";
      break;
    case 3:
      icon = "text-box-plus-outline";
      break;
    case 4:
      icon = "chat-plus-outline";
      break;
    case 5:
      icon = "file-image-outline";
      break;
    default:
      break;
  }

  return icon;
};

const itemAction = (action) => {
  emit("itemAction", action);
};

const itemChange = (value) => {
  emit("itemChange", value);
};
</script>

<template>
  <section class="relative flex">
    <v-card class="relative w-full !p-18">
      <div>
        <BaseInput v-if="textField" :label="label" :value="value" @input="itemChange($event)" />
        <BaseInput v-if="textArea" type="textarea" :label="label" :value="value" @input="itemChange($event)" />
        <UploadImage v-if="image" :image="value" @change="itemChange($event)" />
      </div>
    </v-card>
    <div class="absolute right-[-280px] top-10 flex cursor-pointer">
      <div v-for="(action, index) in actions" :key="index" icon small class="mr-[28px]" @click="itemAction(action)">
        <v-icon>mdi-{{ actionIcon(action) }}</v-icon>
      </div>
    </div>
  </section>
</template>
