<template>
  <div class="flex flex-col overflow-hidden rounded-2xl bg-light-gray">
    <div class="relative">
      <div class="left-5 absolute top-6 z-10 flex items-center rounded-2xl bg-black/50 py-6 px-8 text-white">
        <svg viewBox="0 0 24 24" class="h-14 w-14">
          <path
            d="M11.54 2.781a.5.5 0 01.92 0l2.435 5.657a.5.5 0 00.413.3l6.133.569a.5.5 0 01.284.873l-4.627 4.065a.5.5 0 00-.158.486l1.354 6.009a.5.5 0 01-.743.54l-5.296-3.145a.5.5 0 00-.51 0l-5.296 3.144a.5.5 0 01-.743-.54l1.354-6.008a.5.5 0 00-.158-.486L2.275 10.18a.5.5 0 01.284-.873l6.133-.569a.5.5 0 00.413-.3l2.436-5.657z"
            fill="currentColor"
          ></path>
        </svg>
        <span class="pl-5 text-12">
          {{ rating }}
        </span>
      </div>
      <img
        v-lazysrc="imgSrc"
        class="h-240 max-h-240 w-full grow overflow-hidden rounded-2xl object-cover"
        alt=" "
        height="240"
        width="352"
      />
      <div class="absolute left-12 bottom-16 rounded-2xl bg-black/50 py-6 px-8 text-12 text-white">{{ price }}</div>
    </div>
    <div class="my-auto flex flex-col py-18 px-16">
      <div class="text-14 text-gray">{{ item.ageRestriction }}+ &#183; {{ item.category }}&#183; {{ item.place }}</div>
      <h3 class="overflow-hidden text-16 font-semibold line-clamp-3 hover:text-secondary-hover">{{ title }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateDiff } from "@/_core/utils/DateUtils";
import { computed } from "vue";
import EventItemModel from "../models/EventItemModel";

const props = defineProps<{
  item: EventItemModel;
}>();

const imgSrc = computed(() => {
  return props.item?.cover || "";
});

const price = computed(() => {
  return props.item.minPrice === 0 ? "Бесплатно!" : `от ${props.item.minPrice} ₽`;
});

const title = computed(() => {
  return props.item?.name || "";
});

const rating = computed(() => {
  return props.item?.rating?.toFixed(1) || "";
});
</script>
