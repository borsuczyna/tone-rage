<template>
  <img :src="`/logo/glow-${glow ?? 5}.png`" :class="className" :style="style" />
</template>

<script setup lang="ts">
interface Props {
  glow?: number;
  style?: Record<string, any>;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  glow: 5
});
</script>
