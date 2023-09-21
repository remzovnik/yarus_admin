<script lang="ts" setup>
import QuestModel from "@/modules/Quests/models/QuestModel";
import BaseModal from "@/components/modal/BaseModal.vue";

const props = withDefaults(
  defineProps<{
    quest: QuestModel;
  }>(),
  { quest: undefined, showButtons: true }
);

const bgColorStyle = (model: QuestModel) => {
  return { background: model.bg_color };
};

const tagBgColorStyle = (model: QuestModel) => {
  return { background: model.ribbon_color };
};
</script>
<template>
  <BaseModal>
    <div class="d-flex flex-col items-center">
      <div class="pa-6 text-h5 font-weight-bold">Превью квеста как главного</div>
      <div class="w-full overflow-hidden rounded-br-[24px] sm:pt-[90px] lg:pt-[120px]">
        <div
          class="main-quest sm:h-min-[500px] bg-gray-700 bg-87% sm:bg-67% relative flex h-auto rounded-[24px] py-20 px-[16px] sm:py-[40px] sm:px-[20px] lg:bg-auto lg:py-[57px] lg:px-[56px]"
        >
          <div class="z-10 mb-[170px] w-full sm:mb-0 sm:w-1/2">
            <div class="text-base text-gray-400 md:text-lg mb-[8px] hidden sm:block lg:mb-24">{{ quest.tagline_main }}</div>
            <div
              class="text-2xl mb-[16px] font-bold leading-[32px] text-white sm:mb-[8px] sm:text-[32px] sm:leading-[40px] xl:mb-[24px] xl:text-[56px] xl:leading-[62px]"
            >
              {{ quest.title }}
            </div>
            <div class="text-gray-200 sm:text-base lg:text-lg mb-[32px] hidden sm:block">{{ quest.description }}</div>
            <button
              class="text-base color-white rounded-md bg-green-100 py-[13px] px-[80px] duration-200 ease-in hover:bg-green-200 active:bg-green-300 sm:px-[90px]"
            >
              Пройти тест
            </button>
          </div>
          <img
            :src="quest.image"
            class="h-250 rounded-br-large sm:h-475 absolute bottom-[-8%] right-0 object-cover sm:bottom-0 sm:right-[-10%] lg:h-[560px] xl:right-0 xl:h-auto"
            :alt="quest.title"
          />
        </div>
      </div>
      <v-divider class="pa-4"></v-divider>
      <div class="pa-6 text-h5 font-weight-bold">Превью квеста в общем списке</div>
      <div class="d-flex">
        <div
          class="gallery-item mr-[20px] flex w-[516px] cursor-pointer flex-col justify-between overflow-hidden rounded-[24px]"
          :style="bgColorStyle(quest)"
        >
          <div class="px-[24px] pt-[30px] sm:px-[30px] xl:px-[40px]">
            <div class="mb-[16px] inline-block rounded-[5px] px-[8px] py-[2px]" :style="tagBgColorStyle(quest)">
              {{ quest.category.name }}
            </div>
            <div class="text-[18px] font-bold leading-[26px] text-white md:text-[32px] md:leading-[42px]">{{ quest.title }}</div>
          </div>
          <img :src="quest.image" class="gallery-item-img w-[209px] self-end sm:w-auto" :alt="quest.title" />
        </div>
        <div
          class="gallery-item flex h-[484px] w-[516px] cursor-pointer flex-col justify-between overflow-hidden rounded-[24px]"
          :style="bgColorStyle(quest)"
        >
          <div class="px-[24px] pt-[30px] sm:px-[30px] xl:px-[40px]">
            <div class="mb-[16px] inline-block rounded-[5px] px-[8px] py-[2px]" :style="tagBgColorStyle(quest)">
              {{ quest.category.name }}
            </div>
            <div class="text-[18px] font-bold leading-[26px] text-white md:text-[32px] md:leading-[42px]">{{ quest.title }}</div>
          </div>
          <img :src="quest.image" class="gallery-item-img w-[209px] self-end sm:w-auto" :alt="quest.title" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<style lang="scss">
.main-quest {
  max-width: 1392px;
  position: relative;
  background-image: url("/images/quests/ellipse.svg");
  background-repeat: no-repeat;
  background-position: bottom right;
}

.bg-gray-700 {
  background-color: rgba(39, 41, 45, 1);
}

.bg-green-100 {
  background-color: rgba(66, 189, 176, 1);
}

.text-gray {
  &-200 {
    color: rgba(205, 207, 212, 1);
  }
  &-400 {
    color: rgba(104, 104, 104, 1);
  }
}
.gallery-item {
  &:nth-child(1) {
    height: auto;
  }

  &:nth-child(2) img {
    max-height: 292px;
  }
}
</style>
