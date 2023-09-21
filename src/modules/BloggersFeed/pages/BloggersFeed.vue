<script lang="ts" setup>
import { onBeforeMount, ref, watch, inject } from "vue";
import {
  BloggerFeedItemModel,
  ContentType,
  ModerationActionType,
  ModerationStatus,
  NotApproveStatus,
} from "@/modules/BloggersFeed/models/BloggerContentData";
import BloggersFeedService from "@/modules/BloggersFeed/BloggersFeedService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ContentDetailModel from "@/modules/Yarus/models/ContentDetailModel";
import ContentPage from "@/modules/Yarus/components/ContentPage.vue";
import BlockReasonType from "@/modules/Yarus/components/BlockReasonType.vue";
import useFinalModal from "@/components/modal/useFinalModal";

const modal = useFinalModal();

const currentIndex = ref(0);
const itemsList = ref<BloggerFeedItemModel[]>([]);
const currentItem = ref<BloggerFeedItemModel>();
const feedType = ref(ContentType.CLIP);
const stateType = ref(1);

const blockReason = ref<string | null>(null);

const stateTypesData = [
  {
    value: 1,
    label: "Модерация",
  },
  {
    value: 2,
    label: "Одобрено",
  },
  {
    value: 3,
    label: "Не одобрено",
  },
  {
    value: 4,
    label: "Заблокировано",
  },
];

const updateItemsList = async () => {
  const modStatus =
    stateType.value === 1
      ? ModerationStatus.ON_MODERATION
      : stateType.value === 2
      ? ModerationStatus.APPROVED
      : ModerationStatus.NOT_APPROVED;
  let stat;
  if (modStatus === ModerationStatus.NOT_APPROVED) {
    stat = stateType.value === 3 ? NotApproveStatus.DECLINED : NotApproveStatus.BLOCKED;
  }
  itemsList.value = await ServiceLocator.instance.getService(BloggersFeedService).getContentList(feedType.value, modStatus, stat);
  currentIndex.value = 0;
};

const updateCurrentItem = async () => {
  currentItem.value = itemsList.value[currentIndex.value];
  if (currentIndex.value === 0) {
    return;
  }
};

watch(
  () => feedType.value,
  async () => {
    await updateItemsList();
    await updateCurrentItem();
  }
);

watch(
  () => stateType.value,
  async () => {
    await updateItemsList();
    await updateCurrentItem();
  }
);

const nextItem = () => {
  if (currentIndex.value === itemsList.value.length - 1) {
    return;
  }
  currentIndex.value++;
  currentItem.value = itemsList.value[currentIndex.value];
};

const prevItem = () => {
  if (currentIndex.value === 0) {
    return;
  }
  currentIndex.value--;
  currentItem.value = itemsList.value[currentIndex.value];
};

onBeforeMount(async () => {
  await updateItemsList();
  await updateCurrentItem();
});

const changeContentStatus = async (actionType: ModerationActionType) => {
  if (currentItem?.value?.model?.id) {
    await ServiceLocator.instance
      .getService(BloggersFeedService)
      .moderateContent(currentItem?.value?.model?.id, feedType.value, actionType, blockReason.value || "нет");
    blockReason.value = null;
  }
  itemsList.value.splice(currentIndex.value, 1);
  if (itemsList.value.length === 0) {
    await updateItemsList();
    await updateCurrentItem();
  }
  currentIndex.value = currentIndex.value > itemsList.value.length - 1 ? itemsList.value.length - 1 : currentIndex.value;
  updateCurrentItem();
};

const openConfirmDialog = async (reason: string) => {
  blockReason.value = reason;
  const result = await modal.openConfirmDialog("Модерация ленты блогеров", "Подтвердите блокирование контента !");
  if (result) {
    changeContentStatus(ModerationActionType.BLOCK);
  }
};
</script>

<template>
  <section>
    <v-card class="mx-auto" max-width="1200">
      <div class="pa-4 justify-space-between d-flex align-center">
        <v-chip-group v-model="feedType" active-class="bg-primary white-text" selected-class="bg-primary white-text" column>
          <v-chip :value="ContentType.CLIP">Сюжеты</v-chip>
          <v-chip :value="ContentType.VIDEO">Видео</v-chip>
          <v-chip :value="ContentType.POST">Посты</v-chip>
        </v-chip-group>
        <v-chip-group v-model="stateType" active-class="bg-primary white-text" selected-class="bg-primary white-text" column>
          <v-chip v-for="(iter, index) in stateTypesData" :key="index" :value="iter.value">{{ iter.label }}</v-chip>
        </v-chip-group>
      </div>
    </v-card>

    <v-card v-if="!!currentItem && !!currentItem.model" class="pa-4 mx-auto mt-[16px]" max-width="1200">
      <div class="align-center -mt-10 mb-[10px] flex">
        <v-btn color="success" @click="changeContentStatus(ModerationActionType.APPROVE)"> Подтвердить </v-btn>
        <v-btn color="info" class="ml-[8px]" @click="changeContentStatus(ModerationActionType.DECLINE)"> Отклонить </v-btn>
        <block-reason-type @on-select="(reason) => openConfirmDialog(reason)">
          <template #activator>
            <v-btn color="error" class="ml-[8px]"> Блокировать </v-btn>
          </template>
        </block-reason-type>
        <div class="d-flex justify-space-between align-center ml-auto">
          <span class="ml-auto">{{ currentIndex + 1 }} из {{ itemsList.length }}</span>
          <v-card-actions class="mt-0">
            <v-btn variant="outlined" @click="prevItem()">Назад</v-btn>
            <v-btn color="primary" variant="outlined" @click="nextItem()"> Вперед</v-btn>
          </v-card-actions>
        </div>
      </div>
      <v-divider></v-divider>

      <div class="d-flex align-center py-[10px]">
        <router-link
          v-if="(currentItem.model as ContentDetailModel).user"
          class="d-flex align-center py-[10px]"
          :to="{name:'content-user-info',params:{userId:(currentItem.model as ContentDetailModel).user?.id}}"
        >
          <div class="v-avatar" style="height: 48px; min-width: 48px; width: 48px">
            <img :src="(currentItem.model as ContentDetailModel).user?.photo" alt=" " />
          </div>
          <div class="mx-2">
            {{ (currentItem.model as ContentDetailModel).user?.name + ' ' + (currentItem.model as ContentDetailModel).user?.surname   }}
          </div>
        </router-link>

        <router-link
          v-if="(currentItem.model as ContentDetailModel).feed"
          class="d-flex align-center py-[10px]"
          :to="{name:'content-user-info',params:{userId:(currentItem.model as ContentDetailModel).feed?.userId}}"
        >
          <div class="v-avatar" style="height: 48px; min-width: 48px; width: 48px">
            <img :src="(currentItem.model as ContentDetailModel).feed?.image" alt=" " />
          </div>
          <div class="mx-2">
            {{ (currentItem.model as ContentDetailModel).feed?.name  }}
          </div>
        </router-link>
      </div>
      <v-divider></v-divider>
      <ContentPage :current-item="currentItem"></ContentPage>
    </v-card>
  </section>
</template>

<style lang="scss">
.v-card__text,
.v-card__title {
  word-break: normal;
}
</style>
