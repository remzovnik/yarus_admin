<template>
  <div :to="videoRouteLink" class="flex flex-col overflow-hidden rounded-2xl bg-light-gray">
    <div class="relative">
      <img v-lazysrc="imgSrc" class="h-[200px] max-h-[200px] w-full grow overflow-hidden rounded-2xl object-cover" alt=" " />
      <div class="absolute bottom-10 flex w-full items-center justify-between px-[10px]">
        <div class="rounded-2xl bg-black/50 py-[5px] px-[8px] text-12 text-white">{{ timeAgo }}</div>
        <div class="rounded-2xl bg-black/50 py-[5px] px-[8px] text-12 text-white">{{ duration }}</div>
      </div>
    </div>
    <div class="my-auto flex flex-col p-[12px]">
      <p class="overflow-hidden text-14 font-semibold line-clamp-2 hover:text-secondary-hover">{{ title }}</p>
    </div>
    <div class="mb-[6px] mt-auto flex items-center justify-between px-[12px] text-14">
      <div class="flex items-center text-gray">
        <img src="/icons/show_count.svg" class="h-[18px] w-[18px] text-gray" width="18" height="18" alt=" " />
        <span class="ml-[4px] text-14">{{ showCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateDiff } from "@/_core/utils/DateUtils";
import { computed } from "vue";
import VideoPlayer from "@/components/VideoPlayer.vue";
import VideoModel from "../models/VideoModel";

const props = defineProps<{
  item: VideoModel;
}>();

const videoRouteLink = computed(() => {
  return { name: "video-card", params: { id: props.item.id } };
});

const imgSrc = computed(() => {
  return props.item?.image || "";
});

const title = computed(() => {
  return props.item?.name || "";
});

const timeAgo = computed(() => {
  return dateDiff(props.item?.createDate);
});

const duration = computed(() => {
  return new Date(1000 * props.item?.duration).toISOString().substr(14, 5);
});

const showCount = computed(() => {
  return props.item?.metricsFull?.views || 0;
});
</script>
