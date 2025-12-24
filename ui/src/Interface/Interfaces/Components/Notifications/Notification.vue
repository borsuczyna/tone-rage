<template>
  <div :class="styles.notificationWrapper">
    <div :class="notificationClasses">
      <div :class="styles.titleWrapper">
        <component :is="IconComponent" :class="styles.title" fill="currentColor" :fill-opacity="iconFillOpacity" :size="'1rem'" />
        <span :class="styles.title">{{ data.title }}</span>
      </div>
      <span :class="styles.message">
        <template v-for="(line, index) in messageLines" :key="index">
          <span>{{ line }}</span>
          <br v-if="index < messageLines.length - 1" />
        </template>
      </span>
      <span :class="styles.rightBar"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NotificationData } from '@shared/Models/NotificationData';
import styles from '../../Styles/NotificationsInterface.module.css';
import * as Icons from "lucide-vue-next";
import { NotificationType } from '@shared/Models/NotificationType';

const defaultIcons: {
    [key in NotificationType]: string;
} = {
    [NotificationType.Info]: 'Bell',
    [NotificationType.Warning]: 'AlertTriangle',
    [NotificationType.Error]: 'XCircle',
    [NotificationType.Success]: 'CheckCircle',
}

interface Props {
  data: NotificationData;
}

const props = defineProps<Props>();

const notificationClasses = computed(() => {
  return [
    styles.notification,
    styles[props.data.type.toLowerCase()],
    props.data.hiding ? styles.hiding : ''
  ].filter(Boolean).join(' ');
});

const iconName = computed(() => {
  return props.data.icon ? props.data.icon : defaultIcons[props.data.type];
});

const iconFillOpacity = computed(() => {
  return props.data.iconFillOpacity !== undefined ? props.data.iconFillOpacity : 0.1;
});

const IconComponent = computed(() => {
  // Convert kebab-case to PascalCase
  const pascalCase = iconName.value.charAt(0).toUpperCase() + 
    iconName.value.slice(1).replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
  return (Icons as any)[pascalCase] || Icons.Bell;
});

const messageLines = computed(() => {
  return props.data.message.split('\n');
});
</script>
