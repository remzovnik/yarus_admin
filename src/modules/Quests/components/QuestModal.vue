<script setup lang="ts">
import { computed, shallowRef, ref, reactive, watch, watchEffect } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import QuestService from "../QuestService";
import QuestModel from "../models/QuestModel";
import QuestCategoryModel from "../models/QuestCategoryModel";
import { DialogMode } from "../models/QuestCommon";
import isLinkValid from "../utils/isLinkValid";
import S3Service, { S3FileType } from "@/modules/Yarus/S3Service";

const FILE_FORMAT_LIST = ["jpg", "jpeg", "png", "bmp", "gif", "svg", "webp"];
const validationErrors = reactive({
  title: "",
  description: "",
  tagline_main: "",
  link: "",
  image: "",
});
let data = ref<QuestModel>(new QuestModel());
let isModalShown = ref<boolean>(false);
const props = defineProps<{
  inputFormData: QuestModel;
  mode: DialogMode;
  modalState: boolean;
  categoryList: QuestCategoryModel[];
}>();

const emit = defineEmits(["save", "close"]);

watchEffect(() => {
  data.value = !!props.inputFormData ? QuestModel.fromPlainIfNotClass(QuestModel, { ...props.inputFormData }) : new QuestModel();
  isModalShown.value = props.modalState;
});

const hasValidationErrors = computed<boolean>(() => {
  return Object.keys(validationErrors).some((key) => !!validationErrors[key]);
});

const categorySelectList = computed<string[]>(() => {
  return props.categoryList.map((item) => item.name);
});

enum Errors {
  required = "Заполните поле",
  link = "Некорректная ссылка",
  imageSize = "Размер файла должен быть не более 1 Мб",
  imageFormat = "Недопустимый формат файла.  Разрешены: jpg, jpeg, png, bmp, gif, svg или webp",
}

const setNewImage = async (files) => {
  const loadedImage = files[0];
  if (isImageValid(loadedImage)) {
    if (!!data.value) {
      // const formData = new FormData();
      // formData.append("image", loadedImage);
      data.value.image = await ServiceLocator.instance.getService(S3Service).uploadFile(S3FileType.IMAGE, loadedImage);
      // data.value.image = await ServiceLocator.instance.getService(QuestService).postNewImage(formData);
    }
  }
};

const changeCategory = (value) => {
  if (!!data.value) {
    const currentCategory = props.categoryList.find((item) => item.name === value);
    if (currentCategory) {
      data.value.category = {
        name: value,
        id: currentCategory.id,
      };
    }
  }
};

const saveFormChanges = async () => {
  validateForm();

  if (!hasValidationErrors.value) {
    if (!!data.value) {
      if (props.mode === DialogMode.edit) {
        await ServiceLocator.instance.getService(QuestService).patchQuest(data.value);
      } else {
        await ServiceLocator.instance.getService(QuestService).createQuest(data.value);
      }

      emit("save");
    }
  }
};

const cancelChanges = () => {
  Object.keys(validationErrors).some((key) => (validationErrors[key] = ""));
  emit("close");
};

const validateForm = () => {
  if (!!data.value) {
    validationErrors.title = !data.value.title?.length ? Errors.required : "";
    validationErrors.description = !data.value.description?.length ? Errors.required : "";
    validationErrors.image = !data.value.image?.length ? Errors.required : "";
    validationErrors.tagline_main = !data.value.tagline_main?.length ? Errors.required : "";
    validationErrors.link = !isLinkValid(data.value.link) ? Errors.link : "";
  }
};

const validateField = (field) => {
  if (!!hasValidationErrors.value) {
    switch (field) {
      case "title": {
        validationErrors.title = !data.value.title?.length ? Errors.required : "";
        break;
      }
      case "description": {
        validationErrors.description = !data.value.description?.length ? Errors.required : "";
        break;
      }

      case "tagline_main": {
        validationErrors.tagline_main = !data.value.tagline_main?.length ? Errors.required : "";
        break;
      }

      case "link": {
        validationErrors.link = !isLinkValid(data.value.link) ? Errors.link : "";
        break;
      }

      default:
        return false;
    }
  }
};

const isImageValid = (file): boolean => {
  if (file.size / 1024 / 1024 > 1) {
    validationErrors.image = Errors.imageSize;
    data.value.image = "";
    return false;
  }

  if (!FILE_FORMAT_LIST.includes(file.type.split("/")[1])) {
    validationErrors.image = Errors.imageFormat;
    return false;
  }

  validationErrors.image = "";
  return true;
};
</script>

<template>
  <v-dialog v-model="isModalShown" scrollable @click:outside="cancelChanges()">
    <v-card class="!mt-[-100px]" width="500">
      <v-card-text class="overflow-y-auto" style="height: 600px">
        <v-form>
          <v-text-field
            v-model="data.title"
            label="Название"
            :error-messages="validationErrors.title"
            @change="validateField('title')"
          ></v-text-field>

          <v-select
            :items="categorySelectList"
            label="Выберите категорию"
            :model-value="data.category?.name"
            @update:model-value="(val) => changeCategory(val)"
          ></v-select>

          <v-text-field
            v-model="data.description"
            label="Описание"
            :error-messages="validationErrors.description"
            @change="validateField('description')"
          ></v-text-field>

          <v-text-field
            v-model="data.tagline_main"
            label="Подзаголовок"
            :error-messages="validationErrors.tagline_main"
            @change="validateField('tagline_main')"
          ></v-text-field>

          <v-file-input
            accept="image/*"
            label="Изображение"
            :error-messages="validationErrors.image"
            :clearable="false"
            @update:model-value="setNewImage"
            @change="validateField('image')"
          ></v-file-input>
          <img v-if="data.image" class="mb-8 h-100 w-120 object-cover" :src="data.image" />

          <v-text-field
            v-model="data.link"
            label="Ссылка"
            :error-messages="validationErrors.link"
            @change="validateField('link')"
          ></v-text-field>

          <v-switch v-model="data.is_main" label="Главный"></v-switch>

          <v-switch v-model="data.is_popular" label="Популярный"></v-switch>

          <div class="mt-8">Цвет фона</div>
          <v-color-picker v-model="data.bg_color" class="ma-2" :hide-sliders="false" mode="hexa"></v-color-picker>

          <div class="mt-8">Цвет ярлыка</div>
          <v-color-picker v-model="data.ribbon_color" class="ma-2" :hide-sliders="false" mode="hexa"></v-color-picker>

          <v-row class="mt-8">
            <v-col>
              <v-btn block @click="cancelChanges()">Отмена</v-btn>
            </v-col>
            <v-col>
              <v-btn color="primary" block :disabled="hasValidationErrors" @click="saveFormChanges()">Сохранить</v-btn>
            </v-col>
          </v-row>

          <div v-if="hasValidationErrors" class="text-sm mt-4 text-v-error">Заполните форму корректно</div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
