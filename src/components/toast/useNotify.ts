import renderComponent from "@/_core/utils/ComponentUtils";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import { ComponentInternalInstance } from "vue";

let toastContainerInstance: ComponentInternalInstance | null = null;

export default function useNotify() {
  const getOrCreateContainer = () => {
    if (!toastContainerInstance) {
      const res = renderComponent(ToastContainer, {});
      toastContainerInstance = res.vNode.component;
    }
    return toastContainerInstance;
  };

  const show = (warning: boolean, text) => {
    const container = getOrCreateContainer();
    if (!!container) {
      container.props.toast = { warning, text, id: Date.now() * Math.random() };
    }
  };

  const warning = (text) => {
    show(true, text);
  };

  const message = (text) => {
    show(false, text);
  };

  return {
    warning,
    message,
  };
}
