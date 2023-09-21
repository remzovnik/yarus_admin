<script setup lang="ts">
import UserModel from "@/modules/Auth/models/UserModel";
import { ref, watch, shallowRef } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import UserService from "../UserService";
import FeedModel from "../models/FeedModel";
import { Pagination } from "@/_core/models/Pagination";
import VideoModel from "../models/VideoModel";
import ClipItemModel from "../models/ClipItemModel";
import ContentDetailModel from "../models/ContentDetailModel";
import { decOfNum } from "@/_core/utils/Formaters";
import PostItem from "@/modules/Yarus/components/PostItem.vue";
import VideoItem from "@/modules/Yarus/components/VideoItem.vue";
import ClipItem from "@/modules/Yarus/components/ClipItem.vue";
import EventItem from "@/modules/Yarus/components/EventItem.vue";
import EventItemModel from "../models/EventItemModel";
import InfiniteScroll from "@/components/InfiniteScroll.vue";
import BlockReasonType from "@/modules/Yarus/components/BlockReasonType.vue";
import ExternalLinkButton from "@/components/ExternalLinkButton.vue";
import ContentPage from "@/modules/Yarus/components/ContentPage.vue";
import BaseModal from "@/components/modal/BaseModal.vue";
import ModerationService from "../ModerationService";
import { BloggerFeedItemModel, FeedItemModelType } from "@/modules/BloggersFeed/models/BloggerContentData";
import ContentService from "../ContentService";
import BaseNotFound from "@/components/BaseNotFound.vue";
import useNotify from "@/components/toast/useNotify";

const enum ContentType {
  FEED,
  FEED_POST,
  POST,
  CLIP,
  VIDEO,
  EVENT,
}

const props = defineProps<{ userId? }>();

const currentContentType = ref(ContentType.FEED);
const pagination = new Pagination({ perPage: 24 });

const userModel = shallowRef(new UserModel());
const userFeedList = shallowRef<FeedModel[]>([]);
const userVideoList = shallowRef<VideoModel[]>([]);
const userClipList = shallowRef<ClipItemModel[]>([]);
const userEventList = shallowRef<EventItemModel[]>([]);
const userPostList = shallowRef<ContentDetailModel[]>([]);

const selectedFeed = ref(0);
const postListByFeed = shallowRef<ContentDetailModel[]>([]);

const showContent = ref(false);
const currentItem = shallowRef<BloggerFeedItemModel>(new BloggerFeedItemModel());

const notify = useNotify();

const getFeedSubscribers = (feed: FeedModel) => {
  const count = feed?.countSubscriber || 0;
  return `${count} ${decOfNum(count, ["подписчиков", "подписчика", "подписчиков"])}`;
};

const blockUser = async (reason: string) => {
  if (props.userId > 0) {
    if (await ServiceLocator.instance.getService(ModerationService).blockUser(props.userId, reason)) {
      notify.message("Пользователь заблокирован !");
    } else {
      notify.warning("Ошибка блокировки !");
    }
    updateUserData();
  }
};

const blockUserContent = async (type: string, id: number, reason: string) => {
  await ServiceLocator.instance.getService(ModerationService).blockUserContent(type, id, reason);

  if (currentContentType.value === ContentType.POST) {
    userPostList.value = userPostList.value.filter((iter) => iter.id != id);
  }

  if (currentContentType.value === ContentType.FEED_POST) {
    postListByFeed.value = postListByFeed.value.filter((iter) => iter.id != id);
  }

  if (currentContentType.value === ContentType.VIDEO) {
    userVideoList.value = userVideoList.value.filter((iter) => iter.id != id);
  }

  if (currentContentType.value === ContentType.CLIP) {
    userClipList.value = userClipList.value.filter((iter) => iter.id != id);
  }
  userModel.value = await ServiceLocator.instance.getService(UserService).getById(props.userId);
};

const updateUserData = async () => {
  clearUserData();
  userModel.value = new UserModel();
  if (props.userId > 0) {
    userModel.value = await ServiceLocator.instance.getService(UserService).getById(props.userId);
    currentContentType.value = ContentType.FEED;
    updateUserFeeds();
  }
};

const changeCurrentContentType = (type: ContentType) => {
  currentContentType.value = type;
  clearUserData();
};

const clearUserData = async () => {
  pagination.currentPage = 0;
  if (currentContentType.value !== ContentType.FEED_POST) {
    userFeedList.value = [];
  }
  userVideoList.value = [];
  userClipList.value = [];
  userEventList.value = [];
  userPostList.value = [];
  postListByFeed.value = [];
};

const updateUserFeeds = async () => {
  clearUserData();
  if (props.userId > 0) {
    userFeedList.value = await ServiceLocator.instance.getService(UserService).getUserFeeds(props.userId);
  }
};

const updateUserPostsByFeed = async () => {
  if (props.userId > 0 && !!selectedFeed.value) {
    postListByFeed.value = [
      ...postListByFeed.value,
      ...(await ServiceLocator.instance.getService(UserService).getPostListByFeed(selectedFeed.value, pagination)),
    ];
    pagination.currentPage++;
  }
};

const updateUserPosts = async () => {
  if (props.userId > 0) {
    userPostList.value = [
      ...userPostList.value,
      ...(await ServiceLocator.instance.getService(UserService).getUserPosts(props.userId, pagination)),
    ];
    pagination.currentPage++;
  }
};

const updateUserVideo = async () => {
  if (props.userId > 0) {
    userVideoList.value = [
      ...userVideoList.value,
      ...(await ServiceLocator.instance.getService(UserService).getUserVideos(props.userId, pagination)),
    ];
    pagination.currentPage++;
  }
};

const updateUserClips = async () => {
  if (props.userId > 0) {
    userClipList.value = [
      ...userClipList.value,
      ...(await ServiceLocator.instance.getService(UserService).getUserClips(props.userId, pagination)),
    ];
    pagination.currentPage++;
  }
};

const updateUserEvents = async () => {
  if (props.userId > 0) {
    userEventList.value = [
      ...userEventList.value,
      ...(await ServiceLocator.instance.getService(UserService).getUserEvents(props.userId, pagination)),
    ];
    pagination.currentPage++;
  }
};

const showPreview = async (type: FeedItemModelType, model: any) => {
  currentItem.value = new BloggerFeedItemModel();
  currentItem.value.type = type;

  if (type === FeedItemModelType.POST) {
    currentItem.value.model = await ServiceLocator.instance.getService(ContentService).getPostById(model.id);
  }
  if (type === FeedItemModelType.VIDEO) {
    currentItem.value.model = await ServiceLocator.instance.getService(ContentService).getVideoById(model.id);
  }
  if (type === FeedItemModelType.CLIP) {
    currentItem.value.model = await ServiceLocator.instance.getService(ContentService).getClipById(model.id);
  }
  showContent.value = true;
};

watch(
  () => props.userId,
  async (_new, _old) => {
    await updateUserData();
  },
  { immediate: true }
);

// 2762263
// 2688
// 4087909
// 1232130 пост с аудио 23781205
</script>

<template>
  <div v-if="!!userModel && userModel.id > 0 && !!userModel.stats" class="mt-20">
    <section class="w-1/2 rounded-2xl bg-bg-gray">
      <div class="flex items-center rounded-2xl bg-secondary-hover p-20">
        <img :src="userModel.photo" class="h-80 w-80 rounded-full object-cover" alt=" " width="80" height="80" />
        <div class="ml-16 flex flex-col text-white">
          <h1 class="text-white">{{ userModel.name + " " + userModel.surname }}</h1>
        </div>
        <BlockReasonType class="ml-auto" @on-select="(reason) => blockUser(reason)"></BlockReasonType>
        <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/u/${userModel.id}`"></ExternalLinkButton>
      </div>
      <div class="flex p-10">
        <v-chip-group active-class="bg-primary white-text" selected-class="bg-primary white-text" column>
          <v-chip
            @click="
              () => {
                changeCurrentContentType(ContentType.FEED);
                updateUserFeeds();
              }
            "
            >Ленты ({{ userModel.stats.feed }})</v-chip
          >
          <v-chip @click="changeCurrentContentType(ContentType.POST)">Посты ({{ userModel.stats.post }})</v-chip>
          <v-chip @click="changeCurrentContentType(ContentType.CLIP)">Сюжеты ({{ userModel.stats.clip }})</v-chip>
          <v-chip @click="changeCurrentContentType(ContentType.VIDEO)">Видео ({{ userModel.stats.video }})</v-chip>
          <v-chip @click="changeCurrentContentType(ContentType.EVENT)">События ({{ userModel.stats.event }})</v-chip>
        </v-chip-group>
      </div>
    </section>

    <section v-if="currentContentType === ContentType.FEED || currentContentType === ContentType.FEED_POST" class="mt-20">
      <h2 class="mb-[16px]">Ленты</h2>
      <div class="grid grid-cols-4 gap-16">
        <div
          v-for="iter in userFeedList"
          :key="iter.id"
          class="relative flex cursor-pointer items-center rounded-2xl border border-primary bg-light-gray p-[16px]"
          @click="
            () => {
              selectedFeed = iter.id;
              changeCurrentContentType(ContentType.FEED_POST);
            }
          "
        >
          <img :src="iter.image" class="h-70 w-70 items-center rounded-full object-cover" />
          <div class="ml-14 flex flex-col">
            <span class="mb-[8px] font-semibold">{{ iter.name }}</span>
            <span class="text-14"> {{ getFeedSubscribers(iter) }}</span>
          </div>
          <div class="absolute -top-18 -right-16">
            <div class="flex">
              <!-- <BlockReasonType @on-select="(reason) => blockUserContent('feed', iter.id, reason)"></BlockReasonType> -->
              <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/f/${iter.id}`"></ExternalLinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="currentContentType === ContentType.FEED_POST" class="mt-20">
      <h2 class="mb-[16px]">Посты ленты</h2>
      <div class="grid grid-cols-5 gap-36">
        <div v-for="iter in postListByFeed" :key="iter.id" class="relative">
          <PostItem :model="iter" @click="showPreview(FeedItemModelType.POST, iter)"> </PostItem>
          <div class="absolute -top-18 -right-16">
            <div class="flex">
              <BlockReasonType @on-select="(reason) => blockUserContent('post', iter.id, reason)"></BlockReasonType>
              <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/p/${iter.id}`"></ExternalLinkButton>
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroll @on-intersect="updateUserPostsByFeed()"></InfiniteScroll>
    </section>

    <section v-if="currentContentType === ContentType.POST" class="mt-20">
      <h2 class="mb-[16px]">Все Посты</h2>
      <div class="grid grid-cols-5 gap-36">
        <div v-for="iter in userPostList" :key="iter.id" class="relative">
          <PostItem :model="iter" @click="showPreview(FeedItemModelType.POST, iter)"></PostItem>
          <div class="absolute -top-18 -right-16">
            <div class="flex">
              <BlockReasonType @on-select="(reason) => blockUserContent('post', iter.id, reason)"></BlockReasonType>
              <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/p/${iter.id}`"></ExternalLinkButton>
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroll @on-intersect="updateUserPosts()"></InfiniteScroll>
    </section>

    <section v-if="currentContentType === ContentType.VIDEO" class="mt-20">
      <h2 class="mb-[16px]">Видео</h2>
      <div class="grid grid-cols-5 gap-36">
        <div v-for="iter in userVideoList" :key="iter.id" class="relative">
          <VideoItem :item="iter" @click="showPreview(FeedItemModelType.VIDEO, iter)"></VideoItem>
          <div class="absolute -top-18 -right-16">
            <div class="flex">
              <BlockReasonType @on-select="(reason) => blockUserContent('video', iter.id, reason)"></BlockReasonType>
              <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/v/${iter.id}`"></ExternalLinkButton>
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroll @on-intersect="updateUserVideo()"></InfiniteScroll>
    </section>

    <section v-if="currentContentType === ContentType.CLIP" class="mt-20">
      <h2 class="mb-[16px]">Сюжеты</h2>
      <div class="grid grid-cols-5 gap-36">
        <div v-for="iter in userClipList" :key="iter.id" class="relative">
          <ClipItem :item="iter" @click="showPreview(FeedItemModelType.CLIP, iter)"></ClipItem>
          <div class="absolute -top-18 -right-16">
            <div class="flex">
              <BlockReasonType @on-select="(reason) => blockUserContent('clip', iter.id, reason)"></BlockReasonType>
              <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/c/${iter.id}`"></ExternalLinkButton>
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroll @on-intersect="updateUserClips()"></InfiniteScroll>
    </section>

    <section v-if="currentContentType === ContentType.EVENT" class="mt-20">
      <h2 class="mb-[16px]">События</h2>
      <div class="grid grid-cols-5 gap-36">
        <div v-for="iter in userEventList" :key="iter.id" class="relative">
          <EventItem :item="iter"></EventItem>
          <div class="absolute -top-18 -right-16">
            <div class="flex">
              <!-- <BlockReasonType @on-select="(reason) => blockUserContent('event', iter.id, reason)"></BlockReasonType> -->
              <ExternalLinkButton class="ml-[4px]" :url="`https://yarus.ru/e/${iter.id}`"></ExternalLinkButton>
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroll @on-intersect="updateUserEvents()"></InfiniteScroll>
    </section>

    <BaseModal v-model="showContent" click-to-close :esc-to-close="true" :show-buttons="false" @confirm="showContent = false">
      <ContentPage v-if="!!currentItem.model" :current-item="currentItem"></ContentPage>
    </BaseModal>
  </div>
  <BaseNotFound v-else><h2>Пользователь не найден!</h2></BaseNotFound>
</template>
