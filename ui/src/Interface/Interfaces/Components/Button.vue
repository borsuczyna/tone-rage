<template>
  <div :class="wrapperClass" :style="{ ...style, ...wrapperStyle }">
    <!-- Glow effect - only for variants that support it -->
    <button 
      v-if="glow && (variant === 'primary' || variant === 'secondary' || variant === 'glass')"
      :class="glowClass"
      aria-hidden="true"
      tabindex="-1"
      :style="style"
    >
      <Loader2 v-if="loading" :size="'1rem'" :class="styles.spin" />
      <slot v-else />
    </button>
    
    <!-- Main button -->
    <button 
      v-bind="$attrs"
      :class="buttonClass"
      :style="style"
      :disabled="isDisabled"
    >
      <Loader2 v-if="loading" :size="'1rem'" :class="styles.spin" />
      <slot v-else />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from "lucide-vue-next";
import styles from './Button.module.css';
import csx from '../../../Utils/MergeClass';

interface Props {
  variant?: 'primary' | 'secondary' | 'dark' | 'glass' | 'ghost' | 'link' | 'gray';
  size?: 'small' | 'medium' | 'large';
  glow?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  wrapperStyle?: Record<string, any>;
  style?: Record<string, any>;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  glow: true,
  loading: false,
  disabled: false,
  fullWidth: false,
  class: ''
});

const buttonClass = computed(() => 
  `${styles.toneButton} ${styles[props.variant]} ${styles[props.size]} ${props.class}`
);

const glowClass = computed(() => 
  `${styles.glowEffect} ${styles[props.variant]}`
);

const isDisabled = computed(() => props.disabled || props.loading);

const wrapperClass = computed(() => 
  csx(
    styles.buttonWrapper,
    isDisabled.value ? styles.disabled : '',
    props.fullWidth ? styles.fullWidth : ''
  )
);
</script>
