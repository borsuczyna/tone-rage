<template>
  <div v-if="isOpen" :class="styles.modalOverlay" @click="onClose">
    <div :class="styles.modalContent" @click.stop>
      <div :class="styles.modalHeader">
        <h2>{{ title }}</h2>
        <button :class="styles.closeButton" @click="onClose">
          <X :size="20" />
        </button>
      </div>
      <div :class="styles.modalBody">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import styles from './Modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

defineProps<Props>();
</script>
