<script setup lang="ts">
import { computed, shallowRef, ref, inject } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import QuestService from "../QuestService";
import { onBeforeMount } from "vue";
import QuestModel from "../models/QuestModel";
import QuestCategoryModel from "../models/QuestCategoryModel";
import { VueFinalModalProperty } from "vue-final-modal";
import { DialogMode } from "../models/QuestCommon";
import BaseYesNoDialog from "@/components/modal/BaseYesNoDialog.vue";
import QuestModal from "../components/QuestModal.vue";
import QuestPreview from "../components/QuestPreview.vue";
import useFinalModal from "@/components/modal/useFinalModal";

enum TableItemType {
  quest = "quest",
  category = "category",
}

const $vfm: VueFinalModalProperty | undefined = inject("$vfm");
const questList = ref<QuestModel[]>([]);
const editableItem = ref<QuestModel>(new QuestModel());
const isModalShown = ref<boolean>(false);
const isNewCategoryValid = ref<boolean>(true);
const linkToApp = ref<string>("");
const categoryList = ref<QuestCategoryModel[]>([]);
let newCategory = ref<string>("");
let dialogMode = ref<DialogMode>(DialogMode.create);

const previewModal = useFinalModal();

const LINK_MATCHER = /^(https?:\/\/)[a-zа-я0-9]+([-.]{1}[a-zа-я0-9]+)*\.[a-zа-я]{2,9}(:[0-9]{1,5})?(\/.*)?$/;

const isLinkToAppValid = computed(() => {
  return linkToApp.value.match(LINK_MATCHER);
});

onBeforeMount(async () => {
  questList.value = await ServiceLocator.instance.getService(QuestService).getQuestList();
  categoryList.value = await ServiceLocator.instance.getService(QuestService).getCategoryList();
  linkToApp.value = await ServiceLocator.instance.getService(QuestService).getDownloadAppLink();
});

const showEditForm = (item) => {
  dialogMode.value = DialogMode.edit;
  isModalShown.value = true;
  editableItem.value = item;
};

const showCreateForm = () => {
  dialogMode.value = DialogMode.create;
  editableItem.value = new QuestModel();
  editableItem.value.category = categoryList.value[0];
  isModalShown.value = true;
};

const showPreview = async (item) => {
  await previewModal.show(QuestPreview, { quest: item });
};

const handleModalSave = async () => {
  isModalShown.value = false;
  questList.value = await ServiceLocator.instance.getService(QuestService).getQuestList();
};

const handleModalClose = () => {
  isModalShown.value = false;
};

const removeQuest = async (id) => {
  await ServiceLocator.instance.getService(QuestService).removeQuest(id);
  questList.value = await ServiceLocator.instance.getService(QuestService).getQuestList();
};

const setLinkToApp = async () => {
  await ServiceLocator.instance.getService(QuestService).postDownloadAppLink(linkToApp.value);
};

const createNewCategory = async () => {
  if (!!newCategory.value.length) {
    if (!isNewCategoryValid.value) {
      isNewCategoryValid.value = true;
    }
    await ServiceLocator.instance.getService(QuestService).createNewCategory(newCategory.value);
    newCategory.value = "";
    categoryList.value = await ServiceLocator.instance.getService(QuestService).getCategoryList();
  } else {
    isNewCategoryValid.value = false;
  }
};

const removeCategory = async (id) => {
  await ServiceLocator.instance.getService(QuestService).removeCategory(id);
  categoryList.value = await ServiceLocator.instance.getService(QuestService).getCategoryList();
};

const checkDisabled = (id) => {
  return !!questList.value.find((item) => item.category.id === id);
};

const openConfirmDialog = async (type, id) => {
  const result = await openDialog();
  if (result) {
    if (type === TableItemType.quest) {
      removeQuest(id);
    }

    if (type === TableItemType.category) {
      removeCategory(id);
    }
  }
};

const openDialog = async () => {
  return new Promise((resolve) => {
    $vfm?.show({
      component: BaseYesNoDialog,
      bind: { showButtons: true, resolve, text: "Подтвердите удаление" },
    });
  });
};

const getJsonFile = () => {
  const blob = new Blob([JSON.stringify(questList.value)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "questList";
  a.click();
  a.remove();
};
</script>

<template>
  <main>
    <section>
      <h1>Квесты</h1>
      <v-table class="mt-[8px]" density="default">
        <tbody>
          <tr v-for="item in questList" :key="item.id">
            <td class="!h-[64px]">{{ item.title }}</td>
            <td class="!h-[64px]">{{ item.tagline_main }}</td>
            <td class="!h-[64px] !w-[138px]">
              <div class="d-flex align-center !h-[64px] justify-end">
                <v-btn size="small" @click="showPreview(item)">Показать превью</v-btn>
              </div>
            </td>
            <td class="!h-[64px] !w-[138px]">
              <div class="d-flex align-center !h-[64px] justify-end">
                <v-btn size="small" @click="showEditForm(item)">Изменить</v-btn>
              </div>
            </td>

            <td class="!h-[64px] !w-[138px]">
              <div class="d-flex align-center !h-[64px] justify-end">
                <v-btn color="warning" size="small" @click="openConfirmDialog(TableItemType.quest, item.id)">Удалить</v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-end">
        <v-btn class="mt-8 mr-20 !h-[56px] w-[192px]" @click="getJsonFile">Выгрузить json-файл</v-btn>
        <v-btn color="primary" class="mt-8 !h-[56px] w-[192px]" @click="showCreateForm()">Создать</v-btn>
      </div>
    </section>

    <section class="mt-[64px]">
      <h2>Категории</h2>
      <v-table class="mt-[8px]" density="default">
        <tbody>
          <tr v-for="item in categoryList" :key="item.id">
            <td class="!h-[64px]">{{ item.name }}</td>
            <td class="d-flex align-center !h-[64px] justify-end">
              <v-btn
                color="warning"
                size="small"
                :disabled="checkDisabled(item.id)"
                @click="openConfirmDialog(TableItemType.category, item.id)"
                >Удалить</v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-row class="mt-[8px]">
        <v-col cols="9">
          <v-text-field
            v-model="newCategory"
            label="Новая категория"
            :error-messages="!isNewCategoryValid ? 'Заполните поле' : ''"
          ></v-text-field>
        </v-col>
        <v-col cols="3"><v-btn color="primary" class="!h-[56px]" block @click="createNewCategory()">Создать</v-btn></v-col>
      </v-row>
    </section>

    <section class="mt-[64px]">
      <h2>Ссылка на приложение</h2>
      <v-row class="mt-[8px]">
        <v-col cols="9">
          <v-text-field
            v-model="linkToApp"
            label="Ссылка на приложение"
            :error-messages="!isLinkToAppValid ? 'Введите корректную ссылку' : ''"
          />
        </v-col>
        <v-col cols="3">
          <v-btn color="primary" block class="!h-[56px]" :disabled="!isLinkToAppValid" @click="setLinkToApp()">Сохранить</v-btn>
        </v-col>
      </v-row>
    </section>

    <QuestModal
      :input-form-data="editableItem"
      :mode="dialogMode"
      :modal-state="isModalShown"
      :category-list="categoryList"
      @save="handleModalSave"
      @close="handleModalClose"
    />
  </main>
</template>
