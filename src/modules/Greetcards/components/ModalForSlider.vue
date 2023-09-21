<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch, WritableComputedRef } from "vue";
import { GreetCardSliderModel, validationsRule } from "@/modules/Greetcards/models/GreetCardSliderModel";
import GreetCardCategoryModel from "@/modules/Greetcards/models/GreetCardCategoryModel";
import useVuelidate from "@vuelidate/core";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseMultiSelect from "@/components/forms/BaseMultiSelect.vue";
import BaseModal from "@/components/modal/BaseModal.vue";

const props = defineProps<{
  model: GreetCardSliderModel;
  dialog: boolean;
  categoryList: GreetCardCategoryModel[];
}>();

const internalModel = shallowRef<GreetCardSliderModel>(new GreetCardSliderModel());

const v$ = useVuelidate(validationsRule(), internalModel);

const emit = defineEmits<{
  (e: "update:dialog", opt: boolean): void;
  (e: "ready", model: GreetCardSliderModel): void;
}>();

const dialogState: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return props.dialog;
  },
  set(newValue: boolean) {
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

const selectedCategory = computed({
  get: () => {
    return props.categoryList.find((iter) => iter.id == internalModel.value.category_id) || new GreetCardCategoryModel();
  },
  set: (newValue: GreetCardCategoryModel) => {
    internalModel.value.category_id = newValue.id;
  },
});
</script>
<template>
  <BaseModal v-model="dialogState">
    <div style="max-width: 500px" class="pa-4 mx-auto">
      <div class="text-center">{{ model.id ? `Редактирование слайдера ${model.title}` : "Создание слайдера" }}</div>
      <BaseMultiSelect
        v-model="selectedCategory"
        placeholder="Категория*"
        :options="categoryList"
        label="title"
        track-by="title"
        class="mt-[24px]"
        :has-error="v$.category_id.$error"
      ></BaseMultiSelect>
      <base-input
        v-model="internalModel.title"
        class="mt-[24px]"
        label="Название"
        :has-error="v$.title.$error"
        @blur="v$.title.$touch()"
      ></base-input>
      <base-input
        v-model="internalModel.description"
        class="mt-[24px]"
        label="Placeholder для поля с сообщением*"
        :has-error="v$.description.$error"
        @blur="v$.description.$touch()"
      ></base-input>
      <base-input
        v-model="internalModel.position"
        :mask="{
          mask: Number,
          min: 1,
        }"
        label="Позиция"
        class="mt-[24px]"
      ></base-input>
      <v-switch v-model="internalModel.is_active" label="Активно" class="mt-[24px]"></v-switch>
      <div class="mt-32 flex justify-between">
        <v-btn color="secondary" variant="outlined" @click="dialogState = false">Отмена</v-btn>
        <v-btn color="primary" variant="outlined" @click="sendForm">Сохранить</v-btn>
      </div>
    </div>
  </BaseModal>
</template>
