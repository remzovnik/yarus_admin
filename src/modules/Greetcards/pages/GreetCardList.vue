<script lang="ts" setup>
import { inject, defineAsyncComponent, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import GreetCardService from "@/modules/Greetcards/GreetCardService";
import GreetCardCategoryModel from "../models/GreetCardCategoryModel";
import { GreetCardSliderModel } from "../models/GreetCardSliderModel";
import { GreetCardModel } from "../models/GreetCardModel";
import ModalForGreetCategory from "@/modules/Greetcards/components/ModalForCategory.vue";
import ModalForCard from "@/modules/Greetcards/components/ModalForCard.vue";
import ModalForSlider from "@/modules/Greetcards/components/ModalForSlider.vue";
import BaseYesNoDialog from "@/components/modal/BaseYesNoDialog.vue";
import { VueFinalModalProperty } from "vue-final-modal";

const draggable = defineAsyncComponent(() => import("vuedraggable"));

const items = ref<GreetCardCategoryModel[]>([]);
const dialogForCategory = ref(false);
const dialogForSlider = ref(false);
const dialogForCard = ref(false);
const groupList = ref<GreetCardSliderModel[]>([]);
const categoryList = ref<GreetCardCategoryModel[]>([]);

const currentCategoryModel = ref<GreetCardCategoryModel>(new GreetCardCategoryModel());
const currentSliderModel = ref<GreetCardSliderModel>(new GreetCardSliderModel());
const currentCardModel = ref<GreetCardModel>(new GreetCardModel());

const $vfm: VueFinalModalProperty | undefined = inject("$vfm");

const drag = ref(false);
enum GreetCardContentType {
  CARD,
  CATEGORY,
  SLIDER,
}

const updateItemsList = async () => {
  items.value = [];
  items.value = await ServiceLocator.instance.getService(GreetCardService).getCategoryList();
  groupList.value = await ServiceLocator.instance.getService(GreetCardService).getSliderList();
  categoryList.value = await ServiceLocator.instance.getService(GreetCardService).getCategoryList();
};

const showDialogForCategory = (model?: GreetCardCategoryModel) => {
  const editModel = !!model ? { ...model } : new GreetCardCategoryModel();
  currentCategoryModel.value = GreetCardCategoryModel.fromPlainIfNotClass(GreetCardCategoryModel, editModel);
  dialogForCategory.value = true;
};

const showDialogForSlider = (model?: GreetCardSliderModel) => {
  const editModel = !!model ? { ...model } : new GreetCardSliderModel();
  currentSliderModel.value = GreetCardSliderModel.fromPlainIfNotClass(GreetCardSliderModel, editModel);
  dialogForSlider.value = true;
};

const showDialogForCard = (model?: GreetCardModel) => {
  const editModel = !!model ? { ...model } : new GreetCardModel();
  currentCardModel.value = GreetCardModel.fromPlainIfNotClass(GreetCardModel, editModel);
  dialogForCard.value = true;
};

const openConfirmDialog = async (model, modelType) => {
  const result = await openDialog();
  if (result) {
    if (modelType == GreetCardContentType.CATEGORY) {
      await deleteCategory(model);
    }
    if (modelType == GreetCardContentType.SLIDER) {
      await deleteSlider(model);
    }
    if (modelType == GreetCardContentType.CARD) {
      await deleteCard(model);
    }
  }
};

const editCategory = async (model: GreetCardCategoryModel): Promise<void> => {
  await ServiceLocator.instance.getService(GreetCardService).createOrUpdateCategory(model);
  dialogForCategory.value = false;
  currentCategoryModel.value = new GreetCardCategoryModel();
  await updateItemsList();
};

const editSlider = async (model: GreetCardSliderModel): Promise<void> => {
  await ServiceLocator.instance.getService(GreetCardService).createOrUpdateSlider(model);
  dialogForSlider.value = false;
  currentSliderModel.value = new GreetCardSliderModel();
  await updateItemsList();
};

const editCard = async (model: GreetCardModel): Promise<void> => {
  await ServiceLocator.instance.getService(GreetCardService).createOrUpdateCard(model);
  dialogForCard.value = false;
  currentCardModel.value = new GreetCardModel();
  await updateItemsList();
};

const deleteCategory = async (model: GreetCardCategoryModel) => {
  await ServiceLocator.instance.getService(GreetCardService).deleteCategory(model.id);
  await updateItemsList();
};

const deleteSlider = async (model: GreetCardSliderModel) => {
  await ServiceLocator.instance.getService(GreetCardService).deleteSlider(model.id);
  await updateItemsList();
};

const deleteCard = async (model: GreetCardModel) => {
  await ServiceLocator.instance.getService(GreetCardService).deleteCard(model.id);
  await updateItemsList();
};

const openDialog = async () => {
  return new Promise((resolve) => {
    $vfm?.show({
      component: BaseYesNoDialog,
      bind: { showButtons: true, resolve, title: "Удаление", text: "Подтвердите удаление !" },
    });
  });
};

const updatePositions = async (event: any, list: any) => {
  const movedFromElId = event.moved.element.id;
  const movedToElId = list[event.moved.newIndex + 1].id;
  await ServiceLocator.instance.getService(GreetCardService).changeCardPosition(movedFromElId, { to: movedToElId });
};

updateItemsList();
</script>
<template>
  <section>
    <v-card class="mx-auto mb-4" max-width="1200">
      <v-card-actions class="pa-4 mt-0">
        <v-btn variant="contained-text" color="primary" @click.stop="showDialogForCategory()"> Создать категорию </v-btn>
        <v-btn variant="contained-text" color="primary" @click.stop="showDialogForSlider()"> Создать слайдер </v-btn>
        <v-btn variant="contained-text" color="primary" @click.stop="showDialogForCard()"> Создать открытку </v-btn>
      </v-card-actions>
    </v-card>
    <div v-if="!!items.length">
      <v-card v-for="(category, index) in items" :key="index" class="pa-4 mx-auto mb-4" max-width="1200">
        <div class="text-h5">Категория : {{ category.title }} (ID:{{ category.id }})</div>
        <div>Позиция : {{ category.position }}</div>
        <div>Активно : {{ category.is_active ? "Да" : "Нет" }}</div>
        <div class="d-flex mb-3">
          <v-btn class="mr-2" variant="contained-text" color="secondary" @click.stop="showDialogForCategory(category)">
            Редактировать
          </v-btn>
          <v-btn variant="contained-text" color="error" @click.stop="openConfirmDialog(category, GreetCardContentType.CATEGORY)">
            Удалить
          </v-btn>
        </div>
        <v-divider></v-divider>
        <div v-if="!!category.groups.length">
          <div v-for="(slider, categoryIndex) in category.groups" :key="categoryIndex" class="pa-4">
            <div class="pa-1 font-weight-bold">Слайдер : {{ slider.title }} (ID:{{ slider.id }})</div>
            <div class="pa-1">Placeholder для сообщения к открыткам : {{ slider.description }}</div>
            <div class="pa-1">Позиция : {{ slider.position }}</div>
            <div class="pa-1 mb-2">Активно : {{ slider.is_active ? "Да" : "Нет" }}</div>
            <div class="d-flex mb-3">
              <v-btn class="mr-2" variant="contained-text" color="secondary" @click.stop="showDialogForSlider(slider)">
                Редактировать
              </v-btn>
              <v-btn variant="contained-text" color="error" @click.stop="openConfirmDialog(slider, GreetCardContentType.SLIDER)">
                Удалить
              </v-btn>
            </div>
            <v-divider class="mb-3"></v-divider>
            <div v-if="!!slider?.cards?.length">
              <div class="font-weight-bold mb-3">Открытки:</div>
              <v-row>
                <draggable
                  v-model="slider.cards"
                  item-key="position"
                  class="v-row"
                  direction="horizontal"
                  @start="drag = true"
                  @end="drag = false"
                  @change="updatePositions($event, slider.cards)"
                >
                  <template #item="{ element }">
                    <v-col cols="12" md="3" class="d-flex flex-column">
                      <div class="pa-4 border">
                        <img :src="element.image_url" alt="" />
                        <div>Активно: {{ element.is_active ? "Да" : "Нет" }}</div>
                        <div class="d-flex flex-column">
                          <v-btn class="mb-2" variant="contained-text" color="secondary" @click.stop="showDialogForCard(element)">
                            Редактировать
                          </v-btn>
                          <v-btn
                            variant="contained-text"
                            color="error"
                            @click.stop="openConfirmDialog(element, GreetCardContentType.CARD)"
                          >
                            Удалить
                          </v-btn>
                        </div>
                      </div>
                    </v-col>
                  </template>
                </draggable>
              </v-row>
            </div>
            <div v-else>Открыток пока нет.</div>
            <v-divider class="my-3"></v-divider>
          </div>
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-card class="pa-4 mx-auto mb-4 text-center" max-width="1200"> Ничего нет.</v-card>
    </div>
    <ModalForCard v-model:dialog="dialogForCard" :model="currentCardModel" :group-list="groupList" @ready="editCard" />
    <ModalForGreetCategory v-model:dialog="dialogForCategory" :model="currentCategoryModel" @ready="editCategory" />
    <ModalForSlider
      v-model:dialog="dialogForSlider"
      :model="currentSliderModel"
      :category-list="categoryList"
      @ready="editSlider"
    />
  </section>
</template>
