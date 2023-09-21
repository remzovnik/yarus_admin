<script setup lang="ts">
import { ref } from "vue";
import { BlockReasonType } from "../models/BlockReasonType";
import { onClickOutside } from "@vueuse/core";

const reasonlist = ref();
const menuOpened = ref(false);
const reasonList = BlockReasonType;

const emit = defineEmits(["on-select"]);

const onSelectMenu = (value: string) => {
  menuOpened.value = false;
  emit("on-select", value);
};

onClickOutside(reasonlist, () => {
  menuOpened.value = false;
});
</script>

<template>
  <div>
    <v-menu ref="reasonlist" :model-value="menuOpened" :close-on-click="true" :close-on-content-click="true">
      <template #activator="props">
        <div v-bind="props.props" @click="menuOpened = true">
          <slot :props="props" name="activator">
            <v-btn color="warning" icon="mdi-account-cancel" size="x-small"> </v-btn>
          </slot>
        </div>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in reasonList" :key="index" :value="item.reason" @click="onSelectMenu(item.reason)">
          <v-list-item-title>
            <v-tooltip color="primary">
              <template #activator="{ props }">
                <span class="text-14" v-bind="props">{{ item.reason }}</span>
              </template>
              <div class="max-w-[400px] text-14 opacity-100">{{ item.description }}</div>
            </v-tooltip>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss">
.v-list-item {
  // padding: 0px !important;
  min-height: 36px;
}
</style>
