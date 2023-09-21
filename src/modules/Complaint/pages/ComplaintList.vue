<script lang="ts" setup>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ComplaintModel } from "@/modules/Complaint/models/ComplaintModel";
import ComplaintService from "@/modules/Complaint/ComplaintService";
import { useRouter } from "vue-router";

const router = useRouter();
const complaintList = ref<ComplaintModel[]>([]);
const totalRecords = ref(0);
const perPage = 25;
const page = ref<number>(1);
const query = ref("");
const isLoading = ref(false);

const updateComplaintList = ({ currentPage }) => {
  isLoading.value = true;
  page.value = currentPage;
  const offset = (page.value - 1) * perPage;
  const complaintsData = ServiceLocator.instance.getService(ComplaintService).getComplaintList(offset, perPage);
  complaintList.value = complaintsData.complaints;
  totalRecords.value = complaintsData.totalCount;
};

const columns = [
  {
    field: "id",
    label: "ID",
  },
  {
    field: "date",
    label: "Дата",
  },
  {
    field: "material",
    label: "Материал",
  },
  {
    field: "category",
    label: "Категория/*подкатегория",
  },
  {
    field: "user",
    label: "Пользователь",
  },
  {
    field: "email",
    label: "Email",
  },
];

const openComplaintPage = (params) => {
  router.push({ name: "complaint-item", params: { id: params.row.id } });
};
updateComplaintList({ currentPage: 1 });
</script>
<template>
  <section>
    <v-card class="mx-auto mb-20">
      <VueGoodTable
        v-model:isLoading="isLoading"
        mode="remote"
        :total-rows="totalRecords"
        :columns="columns"
        :rows="complaintList"
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
        @page-change="updateComplaintList"
        v-on:row-click="openComplaintPage"
      >
        <template #emptystate> Жалоб не найдено. </template>
        <template #table-row="props">
          <span v-if="props.column.field === 'category'">
            {{ props.row.category.name }}
          </span>
        </template></VueGoodTable
      >
    </v-card>
  </section>
</template>
