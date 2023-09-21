<script setup lang="ts">
import { ContentType, FeedItemModelType } from "@/modules/BloggersFeed/models/BloggerContentData";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "@/components/forms/BaseInput.vue";

const router = useRouter();
const searchUserId = ref<number>();
const postId = ref<number>();
const clipId = ref<number>();
const videoId = ref<number>();

const searchUser = () => {
  router.push({ name: "content-user-info", params: { userId: searchUserId.value } });
};

const searchPost = () => {
  router.push({ name: "content-detail", params: { id: postId.value, contentType: ContentType.POST } });
};

const searchClip = () => {
  router.push({ name: "content-detail", params: { id: clipId.value, contentType: ContentType.CLIP } });
};

const searchVideo = () => {
  router.push({ name: "content-detail", params: { id: videoId.value, contentType: ContentType.VIDEO } });
};

const numberMask = {
  mask: Number,
  min: 1,
};
</script>

<template>
  <section>
    <div class="flex">
      <v-card class="w-[350px]">
        <div class="m-[20px] flex items-center">
          <base-input
            v-model="searchUserId"
            :mask="numberMask"
            placeholder="ID пользователя"
            class="mr-[16px]"
            @keyup.enter="searchUser()"
          ></base-input>
          <v-btn outlined :disabled="!searchUserId" @click="searchUser()">
            <v-icon left>mdi-magnify</v-icon>
            Найти
          </v-btn>
        </div>
      </v-card>

      <v-card class="ml-[32px] w-[350px]">
        <div class="m-[20px] flex items-center">
          <base-input
            v-model="postId"
            :mask="numberMask"
            placeholder="ID поста"
            class="mr-[16px]"
            @keyup.enter="searchPost()"
          ></base-input>
          <v-btn outlined :disabled="!postId" @click="searchPost()">
            <v-icon left>mdi-magnify</v-icon>
            Найти
          </v-btn>
        </div>
      </v-card>

      <v-card class="ml-[32px] w-[350px]">
        <div class="m-[20px] flex items-center">
          <base-input
            v-model="clipId"
            :mask="numberMask"
            placeholder="ID сюжета"
            class="mr-[16px]"
            @keyup.enter="searchClip()"
          ></base-input>
          <v-btn outlined :disabled="!clipId" @click="searchClip()">
            <v-icon left>mdi-magnify</v-icon>
            Найти
          </v-btn>
        </div>
      </v-card>

      <v-card class="ml-[32px] w-[350px]">
        <div class="m-[20px] flex items-center">
          <base-input
            v-model="videoId"
            :mask="numberMask"
            placeholder="ID видео"
            class="mr-[16px]"
            @keyup.enter="searchVideo()"
          ></base-input>
          <v-btn outlined :disabled="!videoId" @click="searchVideo()">
            <v-icon left>mdi-magnify</v-icon>
            Найти
          </v-btn>
        </div>
      </v-card>
    </div>
    <router-view class="mt-60"></router-view>
  </section>
</template>
