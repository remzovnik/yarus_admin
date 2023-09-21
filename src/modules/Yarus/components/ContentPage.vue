<script setup lang="ts">
import { linkifyText } from "@/_core/utils/Formaters";
import ContentDetailModel from "@/modules/Yarus/models/ContentDetailModel";
import ExternalLinkButton from "@/components/ExternalLinkButton.vue";
import { BloggerFeedItemModel, ContentType, FeedItemModelType } from "@/modules/BloggersFeed/models/BloggerContentData";
import VideoModel from "@/modules/Yarus/models//VideoModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ContentService from "../ContentService";
import { defineAsyncComponent, DefineComponent, ref, watchEffect } from "vue";
import BaseNotFound from "@/components/BaseNotFound.vue";
import { computed } from "@vue/reactivity";
import BlockReasonType from "@/modules/Yarus/components/BlockReasonType.vue";
import ModerationService from "../ModerationService";

const VideoPlayer = defineAsyncComponent<DefineComponent>(() => import("@/components/VideoPlayer.vue") as any);

const contentModel = ref<BloggerFeedItemModel>(new BloggerFeedItemModel());
const props = defineProps<{ id?; contentType?: ContentType; currentItem?: BloggerFeedItemModel }>();

watchEffect(async () => {
  if (!!props.currentItem?.model) {
    contentModel.value = props.currentItem;
  } else {
    contentModel.value = new BloggerFeedItemModel();
    contentModel.value.type = ServiceLocator.instance
      .getService(ModerationService)
      .convertContentType2Number(props.contentType as any);
    contentModel.value.model = 0 as any;
    contentModel.value.model =
      props.contentType == ContentType.POST
        ? await ServiceLocator.instance.getService(ContentService).getPostById(props.id || 0)
        : props.contentType == ContentType.VIDEO
        ? await ServiceLocator.instance.getService(ContentService).getVideoById(props.id || 0)
        : props.contentType == ContentType.NEWS
        ? await ServiceLocator.instance.getService(ContentService).getNewsById(props.id || 0)
        : await ServiceLocator.instance.getService(ContentService).getClipById(props.id || 0);
  }
});

const notFoundMessageTest = computed(() => {
  return props.contentType == ContentType.POST
    ? `Пост № ${props.id} не найден !`
    : props.contentType == ContentType.VIDEO
    ? `Видео  № ${props.id} не найдено !`
    : props.contentType == ContentType.NEWS
    ? "Новость не найдена "
    : `Сюжет № ${props.id} не найден !`;
});

const contentYarusUrl = computed(() => {
  return contentModel?.value?.type == FeedItemModelType.POST
    ? `https://yarus.ru/p/${props.id || contentModel?.value?.model.id}`
    : contentModel?.value?.type == FeedItemModelType.VIDEO
    ? `https://yarus.ru/v/${props.id || contentModel?.value?.model.id}`
    : contentModel?.value?.type == FeedItemModelType.NEWS
    ? `https://yarus.ru/news/${props.id || contentModel?.value?.model.id}`
    : `https://yarus.ru/c/${props.id || contentModel?.value?.model.id}`;
});

const blockUserContent = async (reason: string) => {
  const type =
    contentModel?.value?.type === FeedItemModelType.POST
      ? "post"
      : contentModel?.value?.type == FeedItemModelType.VIDEO
      ? "video"
      : "clip";
  await ServiceLocator.instance
    .getService(ModerationService)
    .blockUserContent(type, props.id || contentModel?.value?.model.id, reason);
};
</script>

<template>
  <section v-if="!!contentModel.model && !!contentModel.model.id" class="relative w-[1000px]">
    <template v-if="contentModel.type == FeedItemModelType.POST || contentModel.type == FeedItemModelType.NEWS">
      <div v-for="(item, index) in (contentModel.model as ContentDetailModel).items" :key="index" class="mt-[30px] px-[100px]">
        <template v-if="item.type === 0">
          <h1>{{ item.text }}</h1>
        </template>
        <template v-if="item.type === 1">
          <p class="text-16 md:text-18" style="white-space: pre-wrap" v-html="linkifyText(item.text)"></p>
        </template>
        <template v-if="item.type === 2">
          <img :src="item.image" class="max-h-[740px] w-full overflow-hidden rounded-2xl object-cover" />
        </template>

        <blockquote v-if="item.type === 3" class="blockquote px-[10px]">
          {{ item.text }}
        </blockquote>
        <ExternalLinkButton v-if="item.type === 4 && item.link" class="text-body-1" :url="item.link"> </ExternalLinkButton>
        <div v-if="item.type === 5">
          <audio controls :src="(item as any).audio.url"></audio>
        </div>
        <div v-if="item.type === 6 && !!item.video">
          <VideoPlayer
            ref="poststandartVdeoPlayer"
            class="mt-[16px] h-[470px]"
            :src="item.video.m3u8 ? item.video.m3u8 : item.video.file"
          ></VideoPlayer>
        </div>
      </div>
    </template>

    <template v-if="contentModel.type != FeedItemModelType.POST && contentModel.type != FeedItemModelType.NEWS">
      <div class="px-[100px]">
        <VideoPlayer
          ref="standartVdeoPlayer"
          class="mt-[16px] h-[470px] px-[200px]"
          :src="(contentModel.model as VideoModel).m3u8 ? (contentModel.model as VideoModel).m3u8 : (contentModel.model as VideoModel).file"
        ></VideoPlayer>
        <p class="mt-[16px] mb-0">{{ (contentModel.model as VideoModel).description }}</p>
      </div>
    </template>
    <div class="absolute right-30 top-10 flex">
      <ExternalLinkButton :url="contentYarusUrl"></ExternalLinkButton>
      <BlockReasonType v-if="!!props.id" class="ml-[14px]" @on-select="(reason) => blockUserContent(reason)"></BlockReasonType>
    </div>
  </section>
  <BaseNotFound v-else
    ><h2>{{ notFoundMessageTest }}</h2></BaseNotFound
  >
</template>

<style lang="scss">
.v-card__text,
.v-card__title {
  word-break: normal;
  .video-player {
    height: 470px;
  }
}
</style>
