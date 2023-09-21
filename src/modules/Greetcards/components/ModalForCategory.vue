<script setup lang="ts">
import { computed, watch, ref, WritableComputedRef, shallowRef } from "vue";
import GreetCardCategoryModel from "@/modules/Greetcards/models/GreetCardCategoryModel";
import { validationsRule } from "@/modules/Greetcards/models/GreetCardCategoryModel";
import useVuelidate from "@vuelidate/core";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseModal from "@/components/modal/BaseModal.vue";

const props = defineProps<{
  model: GreetCardCategoryModel;
  dialog: boolean;
}>();

const internalModel = shallowRef<GreetCardCategoryModel>(new GreetCardCategoryModel());

const v$ = useVuelidate(validationsRule(), internalModel);

const emit = defineEmits<{
  (e: "update:dialog", opt: boolean): void;
  (e: "ready", model: any): void;
}>();

const dialogState: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return props.dialog;
  },
  set(newValue: boolean): void {
    emit("update:dialog", newValue);
  },
});

const sendForm = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  }
  emit("ready", internalModel.value);
};

watch(
  () => props.model,
  () => {
    internalModel.value = props.model;
  },
  { immediate: true }
);
</script>
<template>
  <BaseModal v-model="dialogState">
    <v-card min-width="400px">
      <div style="max-width: 500px" class="pa-4 mx-auto">
        <div class="mb-3 text-center">{{ model.id ? `Редактирование категории ${model.title}` : "Создание категории" }}</div>
        <base-input
          v-model="internalModel.title"
          class="mt-[24px]"
          label="Название"
          :has-error="v$.title.$error"
          @blur="v$.title.$touch()"
        ></base-input>
        <v-switch v-model="internalModel.is_active" label="Активно" class="mt-[24px]"></v-switch>
        <base-input
          v-model="internalModel.position"
          :mask="{
            mask: Number,
            min: 1,
          }"
          label="Позиция"
          class="mt-[24px]"
        ></base-input>
        <v-card-actions>
          <v-btn color="primary" variant="outlined" @click="sendForm">Применить</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="outlined" @click="dialogState = false">Отмена</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </BaseModal>
</template>
