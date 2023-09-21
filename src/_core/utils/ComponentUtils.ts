import { Component, App, createVNode, render, VNode, getCurrentInstance } from "vue";

type propsType = { props?: any; children?: unknown; element?: HTMLElement };

const renderComponent = (component: Component, { props, children, element }: propsType) => {
  let el: HTMLElement | null = element || document.createElement("div");
  let vNode: VNode | null = createVNode(component, props, children);

  const instance = getCurrentInstance();
  if (instance?.appContext) {
    vNode.appContext = { ...instance?.appContext };
  }

  render(vNode, el);

  const destroy = () => {
    if (el) render(null, el);
    el = null;
    vNode = null;
  };

  return { vNode, destroy, el };
};

export default renderComponent;
