<script setup lang="ts">
import { computed, ref } from "vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ContentService from "@/modules/Yarus/ContentService";
import { BloggerFeedItemModel, FeedItemModelType, ContentType } from "@/modules/BloggersFeed/models/BloggerContentData";
import ContentPage from "@/modules/Yarus/components/ContentPage.vue";
import NewsItemEditor from "@/modules/NewsEdit/components/NewsItemEditor.vue";
import ContentDetailModel from "@/modules/Yarus/models/ContentDetailModel";
import ContentItemModel from "@/modules/Yarus/models/ContentItemModel";
import useFinalModal from "@/components/modal/useFinalModal";
import UserServie from "@/modules/Yarus/UserService";
import useNotify from "@/components/toast/useNotify";

const modal = useFinalModal();
const notify = useNotify();

const mode = ref(0);
const newsId = ref<number>();
const currentItem = ref<BloggerFeedItemModel>();
const items = ref<any[]>([]);
const newsModel = ref<ContentDetailModel>(new ContentDetailModel());

const actionsFull = [1, 2, 3, 4, 5];

const newsImage = computed(() => {
  return items.value[2].image ? items.value[2] : null;
});

const showMessage = (message: string) => {
  modal.showMessage(message);
};

const searchNews = async () => {
  try {
    newsModel.value = await ServiceLocator.instance.getService(ContentService).getNewsById(newsId.value || 0);
    mode.value = 0;
    if (!!newsModel.value) {
      currentItem.value = new BloggerFeedItemModel();
      currentItem.value.model = newsModel.value;
      currentItem.value.type = FeedItemModelType.NEWS;

      items.value = newsModel.value.items.map((item) => ({
        ...item,
        action: 2,
      }));
    }

    // ServiceLocator.instance.getService(UserServie).getPasswordByPhone("79087440560");
    // eslint-disable-next-line no-empty
  } catch {}
};

const value = (item) => {
  let value;

  switch (item.type) {
    case 0:
    case 1:
    case 3:
      value = item.text;
      break;

    case 2:
      value = item.image;
      break;

    case 4:
      value = item.link;
      break;

    default:
      break;
  }

  return value;
};

const label = (item, index) => {
  let label;

  if (index === 0) {
    label = "Заголовок";
  }

  if (index === 1) {
    label = "Описание";
  }

  if (item.type === 4) {
    label = "Источник";
  }

  if (item.type === 3) {
    label = "Цитата";
  }

  if (item.type === 1 && index !== 1) {
    label = "Абзац";
  }

  if (item.param) {
    label = "Подзаголовок";
  }

  return label;
};

const actions = (item, index) => {
  let actions = actionsFull;

  if (!item.id && item.action === 2) {
    actions = [];
  }

  if (!newsImage.value && index === 1) {
    actions = [5];
  }

  if (item.image && index === 2) {
    actions = actionsFull;
  }

  return actions;
};

const itemAction = (type, index) => {
  if (type === 1) {
    deleteItem(index);
  } else {
    addItem(type, index);
  }
};

const itemChange = (value, index, type) => {
  switch (type) {
    case 0:
      newsModel.value.name = value;
      items.value[index].text = value;
      break;
    case 1:
      newsModel.value.description = value;
      items.value[index].text = value;
      break;
    case 2:
      items.value[index].image = value.mobile.url;
      items.value[index].imageOriginal = value.original.url;
      items.value[index].height = value.mobile.height;
      items.value[index].heightOriginal = value.original.height;
      items.value[index].width = value.mobile.width;
      items.value[index].widthOriginal = value.original.width;
      break;
    case 3:
      items.value[index].text = value;
      break;
    case 4:
      items.value[index].link = value;
      break;
    default:
      break;
  }
};

const deleteItem = (index) => {
  items.value.splice(index, 1);
};

const addItem = (type, index) => {
  const item = createItem(type);
  items.value.splice(index + 1, 0, item);
};

const createItem = (type) => {
  const typesMatcher = {
    2: 0,
    3: 1,
    4: 3,
    5: 2,
  };
  const imageOrSource = [2, 4].includes(typesMatcher[type]);

  const baseObj = {
    id: null,
    image: null,
    imageHeight: null,
    imageWidth: null,
    link: null,
    param: type === 2 ? 3 : null,
    text: null,
    type: typesMatcher[type],
    action: 1,
  };

  return imageOrSource
    ? baseObj
    : {
        ...baseObj,
        audio: null,
        extra: null,
        video: null,
      };
};

const saveChanges = async () => {
  if (!!newsModel.value) {
    newsModel.value.name = items.value[0].text;
    newsModel.value.description = items.value[1].text || "...";
    newsModel.value.feedId = newsModel.value.feed.id;

    newsModel.value.image = !!items.value[2].image ? items.value[2].image : null;
    if (!!items.value[2].image) {
      newsModel.value.imageOriginal = items.value[2].imageOriginal;
      newsModel.value.width = items.value[2].width || items.value[2].imageWidth;
      newsModel.value.widthOriginal = items.value[2].widthOriginal;
      newsModel.value.height = items.value[2].height || items.value[2].imageWidth;
      newsModel.value.heightOriginal = items.value[2].heightOriginal;
    }

    newsModel.value.originalLink = items.value.find((iter) => iter.type === 4)?.link;

    newsModel.value.items = items.value.filter(
      (item) =>
        (!!item.id ||
          (item.action === 1 && !newsModel.value.image) ||
          (item.action === 1 && !!newsModel.value.image && item.image !== newsModel.value.image)) &&
        item.type !== null
    );

    if (newsModel.value.items.length === 0) {
      notify.warning("На беке ошибка возникает, если нет ни одного элемента. Можно попробывать добавить пустой блок ! ");
    }

    if (await ServiceLocator.instance.getService(ContentService).saveNews(newsModel.value)) {
      notify.message("Новость сохранена !");
    } else {
      notify.warning("Ошибка сохранения новости ! ");
    }
    await searchNews();
    mode.value = 0;
  }
};
</script>

<template>
  <section>
    <v-card class="w-[900px]">
      <div class="m-[20px] flex items-center">
        <base-input
          v-model="newsId"
          :mask="{
            mask: Number,
          }"
          placeholder="ID новости"
          class="mr-[16px]"
          @keyup.enter="searchNews()"
        ></base-input>
        <v-btn outlined @click="searchNews()">
          <v-icon left>mdi-magnify</v-icon>
          Найти
        </v-btn>
        <div v-if="!!currentItem" class="ml-32 flex">
          <v-btn v-if="!!newsModel && newsModel.id > 0 && mode === 0" color="primary" class="ml-[8px]" @click="mode = 1">
            Редактировать
          </v-btn>
          <v-btn v-if="!!newsModel && newsModel.id > 0 && mode === 1" color="primary" class="ml-[8px]" @click="saveChanges()">
            Сохранить
          </v-btn>
          <v-btn
            v-if="!!newsModel && newsModel.id > 0"
            color="error"
            class="ml-[22px]"
            @click="showMessage('На беке не реализована ручка')"
          >
            Блокировать
          </v-btn>
        </div>
      </div>
    </v-card>

    <div v-if="!!currentItem" class="mt-40 w-[900px]">
      <ContentPage v-if="mode === 0" :current-item="currentItem" :content-type="ContentType.NEWS" class="mt-40"></ContentPage>
      <NewsItemEditor
        v-for="(item, index) in items"
        v-else
        :key="index"
        class="mb-24"
        :type="item.type"
        :label="label(item, index)"
        :value="value(item)"
        :actions="actions(item, index)"
        @item-action="itemAction($event, index)"
        @item-change="itemChange($event, index, item.type)"
      ></NewsItemEditor>
    </div>
  </section>
</template>
