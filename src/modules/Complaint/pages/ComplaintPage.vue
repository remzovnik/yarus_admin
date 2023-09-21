<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ComplaintModel } from "@/modules/Complaint/models/ComplaintModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ComplaintService from "@/modules/Complaint/ComplaintService";

const props = defineProps<{ id? }>();
const complaintModel = ref(new ComplaintModel());

complaintModel.value = ServiceLocator.instance.getService(ComplaintService).getComplaintById(props.id);
</script>
<template>
  <section>
    <v-card>
      <div class="pa-4">Просмотр жалобы {{ id }}</div>
      <v-table class="mt-[8px]" density="default">
        <tbody>
          <tr>
            <td>Дата</td>
            <td>{{ complaintModel.date }}</td>
          </tr>
          <tr>
            <td>Пользователь</td>
            <td>{{ complaintModel.user }}</td>
          </tr>
          <tr>
            <td>Категория/*подкатегория</td>
            <td>{{ complaintModel.category?.name }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </section>
</template>
