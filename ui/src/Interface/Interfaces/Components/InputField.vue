<template>
  <div :class="styles.inputGroup" :style="groupStyle">
    <label v-if="label">{{ label }}</label>
    <div :class="styles.inputWrapper">
      <slot name="icon" />
      <input
        v-bind="$attrs"
        :class="$attrs.class"
        :value="modelValue"
        @input="onInput"
      />
      <slot name="rightElement" />
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from './InputField.module.css';

interface Props {
  label?: string;
  groupStyle?: Record<string, any>;
  modelValue?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>
