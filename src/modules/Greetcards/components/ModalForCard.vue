<script setup lang="ts">
import { computed, ref, shallowRef, watch, WritableComputedRef } from "vue";
import { GreetCardModel, validationsRule } from "@/modules/Greetcards/models/GreetCardModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import GreetCardService from "@/modules/Greetcards/GreetCardService";
import useVuelidate from "@vuelidate/core";
import { GreetCardSliderModel } from "@/modules/Greetcards/models/GreetCardSliderModel";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseModal from "@/components/modal/BaseModal.vue";
import BaseMultiSelect from "@/components/forms/BaseMultiSelect.vue";

const props = defineProps<{
  model: GreetCardModel;
  dialog: boolean;
  groupList: GreetCardSliderModel[];
}>();

const emit = defineEmits<{
  (e: "update:dialog", opt: boolean): void;
  (e: "ready", model: any): void;
}>();

const internalModel = shallowRef<GreetCardModel>(new GreetCardModel());

const v$ = useVuelidate(validationsRule(), internalModel);

const imageError = ref("");

const setNewImage = async (event) => {
  const formData = new FormData();
  imageError.value = "";
  const format = ["png", "jpg", "jpeg", "svg"];
  const image = event.target.files[0];

  const fsize = image.size / 1024 / 1024;
  if (fsize > 1) {
    imageError.value = "Размер файла должен быть не более 1 Мб !";
    return;
  }

  if (!format.includes(image.type.split("/")[1])) {
    imageError.value = "Недопустимый формат файла.  Разрешены: png, jpg, jpeg, svg";
    return;
  }
  formData.append("image", image);
  internalModel.value.image_url = await ServiceLocator.instance.getService(GreetCardService).loadImageOnServer(formData);
};

const dialogState: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return props.dialog;
  },
  async set(newValue: boolean): Promise<void> {
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

const getImagePath = computed(() => {
  return internalModel.value.image_url ? internalModel.value.image_url : props.model.image_url ? props.model.image_url : null;
});

watch(
  () => props.model,
  () => {
    internalModel.value = props.model;
  },
  { immediate: true }
);

const selectedGroup = computed({
  get: () => {
    return props.groupList.find((iter) => iter.id == internalModel.value.group_id) || new GreetCardSliderModel();
  },
  set: (newValue: GreetCardSliderModel) => {
    internalModel.value.group_id = newValue.id;
  },
});
</script>
<template>
  <BaseModal v-model="dialogState">
    <v-card min-width="400px">
      <div style="max-width: 500px" class="pa-4 mx-auto">
        <div class="mb-3 text-center">{{ model.id ? `Редактирование открытки ${model.id}` : "Создание открытки" }}</div>
        <base-input
          class="mb-5"
          accept="image/*"
          type="file"
          label="Изображение"
          :has-error="v$.image_url.$error"
          @change="setNewImage"
        ></base-input>
        <div v-if="imageError" class="text-sm-subtitle-1 text-red-accent-2">{{ imageError }}</div>
        <img v-if="getImagePath" :src="getImagePath" alt="" width="200" height="100" />
        <BaseMultiSelect
          v-model="selectedGroup"
          placeholder="Категория*"
          :options="groupList"
          label="title"
          track-by="title"
          class="mt-[24px]"
          :has-error="v$.group_id.$error"
        ></BaseMultiSelect>
        <v-switch v-model="internalModel.is_active" label="Активно" class="mt-[24px]"></v-switch>
        <v-card-actions>
          <v-btn color="primary" variant="outlined" @click="sendForm">Применить</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="outlined" @click="dialogState = false">Отмена</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </BaseModal>
</template>
