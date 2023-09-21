import { Component, inject, ref, Ref, SetupContext, watch } from "vue";
import { VueFinalModalProperty } from "vue-final-modal";
import BaseYesNoDialog from "@/components/modal/BaseYesNoDialog.vue";

export default function useFinalModal() {
  const $vfm: VueFinalModalProperty | undefined = inject("$vfm");

  const openDialog = async (component: Component, props?: any) => {
    return new Promise((resolve) => {
      $vfm?.show({
        component: component,
        bind: { ...props, resolve },
      });
    });
  };

  const show = (component: Component, props?: any) => {
    return openDialog(component, props);
  };

  const showMessage = (text: string) => {
    return openDialog(BaseYesNoDialog, { showButtons: false, title: "Внимание", text });
  };

  const openConfirmDialog = (title: string, text: string) => {
    return openDialog(BaseYesNoDialog, { "lock-scroll": false, showButtons: true, title, text });
  };

  return {
    show,
    openConfirmDialog,
    showMessage,
  };
}
