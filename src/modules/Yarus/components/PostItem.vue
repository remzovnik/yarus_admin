<script setup lang="ts">
import { dateDiff } from "@/_core/utils/DateUtils";
import { computed } from "vue";
import ContentDetailModel from "../models/ContentDetailModel";
import VideoPlayer from "@/components/VideoPlayer.vue";

const props = defineProps<{
  model: ContentDetailModel;
}>();

const isSimple = false;

const imgSrc = computed(() => {
  return props.model?.image || props.model?.items?.find((iter) => iter.type === 2)?.image || null;
});

const videoModel = computed(() => {
  return props.model?.items?.find((iter) => iter.type === 6)?.video || null;
});

const title = computed(() => {
  return (
    props.model?.items?.find((iter) => iter.type === 0)?.text ||
    props.model?.items?.find((iter) => iter.type === 1)?.text ||
    props.model.name
  );
});

const timeAgo = computed(() => {
  return dateDiff(props.model?.createDate);
});

const showCount = computed(() => {
  return props.model?.metricsFull?.views || 0;
});

const newsRouteLink = computed(() => {
  return { name: "post-card", params: { id: props.model.id } };
});

const description = computed(() => {
  return props.model?.description || "";
});
</script>

<template>
  <div :to="newsRouteLink" class="flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-light-gray">
    <div class="mb-[8px] flex flex-col px-[12px]" :class="[isSimple ? 'px-[1px] pt-[8px]' : '']">
      <h5 class="overflow-hidden line-clamp-2" :class="[isSimple ? 'text-14 font-normal' : 'text-16 font-semibold']">
        {{ title }}
      </h5>
    </div>

    <div class="mb-[10px] h-[200px] w-full grow overflow-hidden rounded-2xl">
      <img
        v-if="imgSrc"
        v-lazysrc="imgSrc"
        class="h-full max-h-[200px] w-full object-cover"
        :class="[isSimple ? 'contrast-50 hover:contrast-100' : '']"
        alt=" "
      />
    </div>

    <p class="mb-[6px] px-[12px] text-14 leading-20 line-clamp-2">{{ description }}</p>

    <div class="my-[6px] mt-auto flex items-center justify-between px-[12px] text-14">
      <span class="text-gray">{{ timeAgo }}</span>
      <div class="flex items-center text-gray">
        <img src="/icons/show_count.svg" class="h-18 w-18 text-gray" width="18" height="18" alt=" " />
        <span class="ml-[4px] text-14">{{ showCount }}</span>
      </div>
    </div>
  </div>
</template>
