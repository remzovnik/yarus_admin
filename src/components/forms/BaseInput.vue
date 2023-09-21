<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";

const showPassword = ref(false);
const maskFiled = ref<HTMLInputElement | any>();
const textarea = ref<HTMLTextAreaElement>();

const props = withDefaults(
  defineProps<{
    mask?: any;
    triggerOnlyValidMaskValue?: boolean;
    type?: string;
    modelValue?: any;
    isShakeError?: boolean;
    label?: string;
    help?: string;
    errorMessage?: string;
    hasError?: boolean;
    classes?: string;
  }>(),
  { triggerOnlyValidMaskValue: true, type: "text", isShakeError: true }
);

const emit = defineEmits(["update:modelValue", "input"]);

onMounted(async () => {
  await nextTick();
  if (!!props.modelValue && !!maskFiled.value.maskRef) {
    maskFiled.value.maskRef.typedValue = String(props.modelValue);
    maskFiled.value.maskRef.unmaskedValue = String(props.modelValue);
  }
});

const onInput = async (e) => {
  if (!!textarea.value) {
    emit("update:modelValue", e.target.value);
    emit("input", e.target.value);
    return;
  }

  if (!maskFiled.value.maskRef) {
    emit("update:modelValue", e.target.value);
    emit("input", e.target.value);
    return;
  }

  await nextTick();
  if (!!maskFiled?.value && !!maskFiled?.value.maskRef && !props.triggerOnlyValidMaskValue) {
    emit("update:modelValue", maskFiled.value.maskRef.unmaskedValue);
    emit("input", e.target.value);
  }
};

const onDelete = async (e) => {
  if (!!textarea.value) {
    emit("update:modelValue", e.target.value);
    emit("input", e.target.value);
    return;
  }

  if (!!maskFiled.value.maskRef && props.triggerOnlyValidMaskValue) {
    const prevValue = maskFiled.value.maskRef.value;
    const prevUnmaskedValue = maskFiled.value.maskRef.unmaskedValue;
    if (!!e?.target?.maskRef) {
      emit("update:modelValue", "");
    }

    await nextTick();
    maskFiled.value.maskRef.value = prevValue;
    maskFiled.value.maskRef.unmaskedValue = prevUnmaskedValue;
  }
};

const onComplete = async () => {
  await nextTick();
  if (!!maskFiled.value.maskRef) {
    emit("update:modelValue", maskFiled.value.maskRef.unmaskedValue);
  }
};

const currentClasses = computed(() => {
  return {
    "base-input__input--error": props.hasError,
    "base-input__input--help": !!props.help,
  };
});

const resizeTextarea = () => {
  if (!!textarea.value) {
    textarea.value.style.height = textarea.value.scrollHeight - 4 + "px";
  }
};

onMounted(async () => {
  await nextTick();
  resizeTextarea();
});

onUnmounted(() => {
  if (!!maskFiled?.value?.maskRef) {
    maskFiled.value.maskRef.destroy();
    delete maskFiled.value.maskRef;
  }
});
</script>

<template>
  <div class="base-input" :class="{ 'base-input--error': isShakeError && hasError }">
    <label v-if="!!label" class="base-input__label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      ref="textarea"
      rows="1"
      :value="modelValue"
      :type="props.type === 'password' && showPassword ? '' : props.type"
      v-bind="{
        ...$attrs,
        ...{ class: [currentClasses, 'base-input__input', classes, props.type === 'password' ? 'pr-16 md:pr-30' : ''] },
      }"
      @input="(event) => onInput(event)"
      @keyup.delete="onDelete"
      @complete="onComplete"
      @focus="resizeTextarea()"
      @keyup="resizeTextarea()"
    ></textarea>
    <input
      v-else
      ref="maskFiled"
      v-imask="mask"
      :value="modelValue"
      :type="props.type === 'password' && showPassword ? '' : props.type"
      v-bind="{
        ...$attrs,
        ...{ class: [currentClasses, 'base-input__input', classes, props.type === 'password' ? 'pr-16 md:pr-30' : ''] },
      }"
      @input="(event) => onInput(event)"
      @keyup.delete="onDelete"
      @complete="onComplete"
    />
    <a v-if="type === 'password'" href="#" class="z-100 absolute top-0 right-0" @click.prevent="showPassword = !showPassword">
      <img v-show="showPassword" src="/icons/eye-open.svg" width="32" height="32" />
      <img v-show="!showPassword" src="/icons/eye-close.svg" width="32" height="32" />
    </a>

    <slot></slot>

    <transition name="fade">
      <div v-if="!!props.help" class="base-input__help">{{ props.help }}</div>
    </transition>
    <transition name="fade">
      <div v-if="props.hasError">
        {{ props.errorMessage }}
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.base-input {
  position: relative;
  width: 100%;

  &__wrap {
    position: relative;
  }

  &--error {
    animation-name: shakeError;
    animation-fill-mode: forwards;
    animation-duration: 0.6s;
    animation-timing-function: ease-in-out;
  }

  &__input {
    border-bottom: 1px solid #c9c9c9;
    box-sizing: border-box;
    width: 100%;
    outline: none;
    // font-size: 14px;
    // font-weight: 500;
    padding-bottom: 3px;
    &--error {
      border-bottom: 1px solid $red;
    }
    &--help {
      border: 1px solid #3068f7;
    }
    &::placeholder {
      opacity: 1;
      color: $gray;
    }
    &:focus {
      border-bottom: 1px solid $primary;
      outline: none;
    }
  }

  &__label {
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    margin-bottom: 6px;
    color: $gray;
  }

  &__help {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #3068f7;
    position: absolute;
    top: 4px;
    left: 0;
  }

  &__error {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: $red;
    position: absolute;
    margin-top: 4px;
    left: 0;
  }
}
@keyframes shakeError {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0.375rem);
  }
  30% {
    transform: translateX(-0.375rem);
  }
  45% {
    transform: translateX(0.375rem);
  }
  60% {
    transform: translateX(-0.375rem);
  }
  75% {
    transform: translateX(0.375rem);
  }
  90% {
    transform: translateX(-0.375rem);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
