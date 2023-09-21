<script lang="ts" setup>
import { ParserModel, ParserCategory, ParsersActionType, ParserStats } from "@/modules/Parsers/models/ParserModel";
import { ref, onBeforeMount, watch, onMounted } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ParsersService from "@/modules/Parsers/ParsersService";
import { computed } from "@vue/reactivity";

import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";

const category = ref(ParserCategory.ACTIVE);
const parserList = ref<ParserModel[]>([]);
const parserStats = ref<ParserStats>();
const dialog = ref(false);

let currentActionParserModel: ParserModel | null;

const dialogMsg = computed(() => {
  return `${category.value === ParserCategory.DISABLED ? "ВКЛЮЧИТЬ" : "ОТКЛЮЧИТЬ"} парсер ${currentActionParserModel?.name}  ?`;
});

const columns = [
  {
    field: "_id",
    label: "ID Ленты",
    type: "number",
    width: "150px",
    filterOptions: {
      enabled: true,
      placeholder: "ID ленты...",
    },
  },
  {
    field: "name",
    label: "Наименование",
    filterOptions: {
      enabled: true,
      placeholder: "Введите наименование...",
    },
  },
  {
    field: "last_update",
    label: "Дата активности",
    // type: "date",
    // dateInputFormat: "H:mm:SS dd.MM.y",
  },
  {
    field: "actions",
    label: "Действия",
    sortable: false,
  },
];

const updateParserList = async () => {
  parserList.value = [];
  parserList.value = await ServiceLocator.instance.getService(ParsersService).getParserList(category.value);
};

const showDialog = (model: ParserModel) => {
  dialog.value = true;
  currentActionParserModel = model;
};

const changeStatus = async () => {
  dialog.value = false;
  if (!!currentActionParserModel) {
    category.value === ParserCategory.DISABLED
      ? ServiceLocator.instance.getService(ParsersService).setOnParser(currentActionParserModel._id)
      : ServiceLocator.instance.getService(ParsersService).setOffParser(currentActionParserModel._id);
    currentActionParserModel = null;

    updateParserList();
  }
};

const cancelChangeStatus = async () => {
  dialog.value = false;
  currentActionParserModel = null;
};

onMounted(async () => {
  parserStats.value = await ServiceLocator.instance.getService(ParsersService).getSummaryInfo();
});

watch(
  () => category.value,
  async () => {
    updateParserList();
  },
  { immediate: true }
);
</script>

<template>
  <section>
    <v-card class="mx-auto">
      <div class="pa-4 justify-space-between d-flex align-center">
        <v-chip-group v-model="category" active-class="bg-primary white-text" selected-class="bg-primary white-text" column>
          <v-chip :value="ParserCategory.ACTIVE">Работающие ({{ parserStats?.active }})</v-chip>
          <v-chip :value="ParserCategory.INACTIVE">Долго нет новых новостей ({{ parserStats?.inactive }})</v-chip>
          <v-chip :value="ParserCategory.INVALID">Неработающие ({{ parserStats?.invalid }})</v-chip>
          <v-chip :value="ParserCategory.DISABLED">Выключенные ({{ parserStats?.disabled }})</v-chip>
        </v-chip-group>
        <span class="ml-auto font-semibold">Всего парсеров: {{ parserStats?.all }}</span>
      </div>
    </v-card>

    <VueGoodTable
      :columns="columns"
      :rows="parserList"
      class="mt-[16px]"
      :pagination-options="{
        enabled: true,
        perPage: 200,
        jumpFirstOrLast: true,
      }"
    >
      <template #emptystate> Парсеров не найдено. </template>
      <template #table-row="props">
        <span v-if="props.column.field === 'name'">
          <a :href="`https://yarus.ru/f/${props.row['_id']}`" target="_blank">{{ props.row["name"] }}</a>
        </span>
        <span v-if="props.column.field === 'actions'">
          <v-btn
            v-if="category === ParserCategory.DISABLED"
            variant="contained-text"
            color="success"
            @click="showDialog(props.row)"
          >
            Включить
          </v-btn>
          <v-btn v-else variant="contained-text" color="error" @click="showDialog(props.row)"> Выключить </v-btn>
        </span>
      </template>
    </VueGoodTable>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-text>
          {{ dialogMsg }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="changeStatus()">Изменить статус</v-btn>
          <v-btn color="secondary" @click="cancelChangeStatus()">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>
