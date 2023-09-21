<script setup lang="ts">
import S3Service from "@/modules/Yarus/S3Service";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const props = defineProps<{ image?: string }>();
const emit = defineEmits(["change"]);

const loadedImgSrc = ref<string>();
const imageRef = ref();
const loading = ref(false);

const imgSrc = computed(() => {
  return loadedImgSrc.value || props.image;
});

const pickImage = () => {
  imageRef.value.click();
};

const uploadImage = async (event) => {
  loading.value = true;
  const body = await ServiceLocator.instance.getService(S3Service).uploadAndResizeImage(event.target.files[0]);
  loadedImgSrc.value = body?.original.url;
  emit("change", body);
  loading.value = false;
};
</script>

<template>
  <div class="flex justify-between">
    <img v-if="image" :src="imgSrc" width="450" height="300" class="h-[300px] w-[450px] object-cover" />
    <v-btn class="ml-10" color="mainColor" dark :loading="loading" height="40" @click="pickImage()">
      Загрузить
      <v-icon right>mdi-cloud-upload</v-icon>
    </v-btn>
    <input ref="imageRef" type="file" hidden accept="image/*" @change="uploadImage" />
  </div>
</template>
