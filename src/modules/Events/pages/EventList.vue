<script lang="ts" setup>
import { ref, watch } from "vue";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { EventCategory, EventModel, EventModerationActionType, EventStatus } from "@/modules/Events/models/EventModel";
import EventsService from "@/modules/Events/EventsService";
import BaseInput from "@/components/forms/BaseInput.vue";
import useFinalModal from "@/components/modal/useFinalModal";
import useNotify from "@/components/toast/useNotify";

const category = ref(EventCategory.ON_MODERATION);
const eventList = ref<EventModel[]>([]);
const totalRecords = ref(0);
const perPage = 50;
const page = ref<number>(1);
const query = ref("");
const isLoading = ref(false);
const currentVisitedLink = ref("");

const yRusDomainName = "https://yarus.ru";
const modal = useFinalModal();

const notify = useNotify();

const updateEventList = async ({ currentPage }) => {
  isLoading.value = true;
  page.value = currentPage;
  eventList.value = [];
  const offset = (page.value - 1) * perPage;
  const eventsData = await ServiceLocator.instance
    .getService(EventsService)
    .getEventData(category.value, query.value, offset, perPage);
  eventList.value = eventsData.events;
  totalRecords.value = eventsData.totalCount;
  isLoading.value = false;
};

const columns = [
  {
    field: "name",
    label: "Название",
  },
  {
    field: "city",
    label: "Город",
  },
  {
    field: "statusString",
    label: "Статус",
  },
  {
    field: "actions",
    label: "Действия",
    thClass: "!w-[480px]",
  },
];

enum statusesColor {
  pending = "blue",
  approved = "green",
  rejected = "orange",
}

const openConfirmDialog = async (id, actionType) => {
  const result = await modal.openConfirmDialog("Редактирование статуса", "Подтвердите редактирование статуса события!");
  if (result) {
    await ServiceLocator.instance.getService(EventsService).changeStatus(id, actionType);
    const order = eventList.value.find((item) => item.id == id);
    if (order) {
      order.statusString =
        actionType == EventModerationActionType.APPROVE ? EventModerationActionType.APPROVE : EventModerationActionType.REJECT;
    }
  }
};

const deleteEvent = async (id) => {
  const result = await modal.openConfirmDialog("Удаление", "Удалить событие ?");
  if (result) {
    if (await ServiceLocator.instance.getService(EventsService).deleteEvent(id)) {
      const ind = eventList.value.findIndex((item) => item.id == id);
      if (!!ind) {
        eventList.value.splice(ind, 1);
      }
      notify.message("Событие удалено");
    } else {
      notify.warning("Ошибка удаления !");
    }
  }
};

const accentRow = (row) => {
  return currentVisitedLink.value === `${yRusDomainName}/event/${row.id}` ? "bg-grey-lighten-4" : "";
};

watch(query, async (value) => {
  if (!value.length) {
    await updateEventList({ currentPage: 1 });
  }
  if (value.length < 3) {
    return;
  }
  await updateEventList({ currentPage: 1 });
});

watch(
  category,
  async () => {
    await updateEventList({ currentPage: 1 });
  },
  { immediate: true }
);
</script>

<template>
  <section>
    <v-card class="mx-auto mb-20">
      <div class="justify-space-between d-flex align-center p-[12px]">
        <v-chip-group v-model="category" active-class="bg-primary white-text" selected-class="bg-primary white-text" column>
          <v-chip :value="EventCategory.ON_MODERATION">На модерацию</v-chip>
          <v-chip :value="EventCategory.APPROVED">Одобрено </v-chip>
          <v-chip :value="EventCategory.NOT_APPROVED">Не одобрено</v-chip>
        </v-chip-group>
        <div>
          <base-input v-model="query" label="поиск по id (все статусы) / названию (по текущей вкладке)"></base-input>
        </div>
      </div>
    </v-card>
    <VueGoodTable
      v-model:isLoading="isLoading"
      mode="remote"
      :total-rows="totalRecords"
      :columns="columns"
      :rows="eventList"
      class="mt-[16px]"
      :jump-first-or-last="true"
      :sort-options="{
        enabled: false,
      }"
      :pagination-options="{
        enabled: true,
        perPageDropdownEnabled: false,
        nextLabel: 'Следующая страница',
        prevLabel: 'Предыдущая страница',
        perPage: perPage,
      }"
      :row-style-class="accentRow"
      @page-change="updateEventList"
    >
      <template #emptystate> Событий не найдено. </template>
      <template #table-row="props">
        <span v-if="props.column.field === 'name'">
          <a
            :href="`${yRusDomainName}/event/${props.row.id}`"
            :target="'_blank'"
            @click="currentVisitedLink = `${yRusDomainName}/event/${props.row.id}`"
          >
            {{ props.row["name"] }}</a
          >
        </span>
        <span v-if="props.column.field === 'city'">
          {{ props.row.city.name }}
        </span>
        <span v-if="props.column.field === 'statusString'">
          <v-chip :color="statusesColor[props.row.statusString]" dark>
            {{ EventStatus[props.row.statusString] }}
          </v-chip>
        </span>
        <span v-if="props.column.field === 'actions'">
          <v-btn
            variant="outlined"
            color="success"
            class="mr-8"
            @click="openConfirmDialog(props.row.id, EventModerationActionType.APPROVE)"
          >
            Подтвердить
          </v-btn>
          <v-btn
            color="info"
            variant="outlined"
            class="mr-8"
            @click="openConfirmDialog(props.row.id, EventModerationActionType.REJECT)"
          >
            Отклонить
          </v-btn>
          <v-btn color="warning" variant="outlined" @click="deleteEvent(props.row.id, EventModerationActionType.REJECT)">
            Удалить
          </v-btn>
        </span>
      </template>
    </VueGoodTable>
  </section>
</template>
