<script lang="ts" setup>
import { inject, onBeforeMount, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import GreetCardService from "@/modules/Greetcards/GreetCardService";
import GreetCardCategoryModel from "../models/GreetCardCategoryModel";
import { GreetCardSliderModel } from "../models/GreetCardSliderModel";
import { GreetCardModel } from "../models/GreetCardModel";
import ModalForGreetCategory from "@/modules/Greetcards/components/ModalForCategory.vue";
import ModalForCard from "@/modules/Greetcards/components/ModalForCard.vue";
import ModalForSlider from "@/modules/Greetcards/components/ModalForSlider.vue";
import { ModerationActionType } from "@/modules/BloggersFeed/models/BloggerContentData";
import BaseYesNoDialog from "@/components/modal/BaseYesNoDialog.vue";
import { VueFinalModalProperty } from "vue-final-modal";

const items = ref<GreetCardSliderModel[]>([]);
const dialogForSlider = ref(false);
const dialogForCard = ref(false);
const groupList = ref<GreetCardSliderModel[]>([]);
const categoryList = ref<GreetCardCategoryModel[]>([]);

const currentSliderModel = ref<GreetCardSliderModel>(new GreetCardSliderModel());
const currentCardModel = ref<GreetCardModel>(new GreetCardModel());

const $vfm: VueFinalModalProperty | undefined = inject("$vfm");

enum GreetCardContentType {
  CARD,
  CATEGORY,
  SLIDER,
}

const updateItemsList = async () => {
  items.value = [];
  items.value = await ServiceLocator.instance.getService(GreetCardService).getSliderList();
  groupList.value = items.value;
  items.value = items.value.filter((item) => item.category_id == null);
  categoryList.value = await ServiceLocator.instance.getService(GreetCardService).getCategoryList();
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
    if (modelType == GreetCardContentType.SLIDER) {
      await deleteSlider(model);
    }
    if (modelType == GreetCardContentType.CARD) {
      await deleteCard(model);
    }
  }
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

const deleteSlider = async (model: GreetCardSliderModel) => {
  await ServiceLocator.instance.getService(GreetCardService).deleteSlider(model.id);
  await updateItemsList();
};
const deleteCard = async (model: GreetCardModel) => {
  await ServiceLocator.instance.getService(GreetCardService).deleteCard(model.id);
  await updateItemsList();
};
onBeforeMount(async () => {
  await updateItemsList();
});
const openDialog = async () => {
  return new Promise((resolve) => {
    $vfm?.show({
      component: BaseYesNoDialog,
      bind: { showButtons: true, resolve, title: "Удаление сущности", text: "Подтвердите удаление сущности!" },
    });
  });
};
</script>
<template>
  <section>
    <div v-if="!!items.length">
      <v-card v-for="(slider, index) in items" :key="index" class="pa-4 mx-auto mb-4" max-width="1200">
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
            <v-col v-for="(card, cardIndex) in slider.cards" :key="cardIndex" cols="12" md="3" class="d-flex flex-column">
              <div class="pa-4 border">
                <img :src="card.image_url" alt="" />
                <div>Позиция: {{ card.position }}</div>
                <div>Активно: {{ card.is_active ? "Да" : "Нет" }}</div>
                <div class="d-flex flex-column">
                  <v-btn class="mb-2" variant="contained-text" color="secondary" @click.stop="showDialogForCard(card)">
                    Редактировать
                  </v-btn>
                  <v-btn variant="contained-text" color="error" @click.stop="openConfirmDialog(card, GreetCardContentType.CARD)">
                    Удалить
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else>Открыток пока нет.</div>
      </v-card>
    </div>
    <div v-else>
      <v-card class="pa-4 mx-auto mb-4 text-center" max-width="1200"> Ничего нет.</v-card>
    </div>
    <ModalForCard v-model:dialog="dialogForCard" v-model:model="currentCardModel" :group-list="groupList" @ready="editCard" />
    <ModalForSlider
      v-model:dialog="dialogForSlider"
      v-model:model="currentSliderModel"
      :category-list="categoryList"
      @ready="editSlider"
    />
  </section>
</template>
