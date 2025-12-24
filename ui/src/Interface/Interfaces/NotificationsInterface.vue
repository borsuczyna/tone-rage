<template>
  <div :class="styles.main" :style="{ top }">
    <Notification v-for="notification in notifications" :key="notification.key" :data="notification" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { addNotification, useNotifications } from 'src/Hooks/NotificationsProvider';
import styles from './Styles/NotificationsInterface.module.css';
import Notification from './Components/Notifications/Notification.vue';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import type { NotificationData } from '@shared/Models/NotificationData';
import AudioService from 'src/Services/AudioService';

// Preload notification sounds for better performance
const notificationSounds = [
    '/sounds/notifications/error.mp3',
    '/sounds/notifications/info.mp3',
    '/sounds/notifications/success.mp3',
    '/sounds/notifications/warning.mp3'
];

const playNotificationSound = (type: string) => {
    const soundMap: Record<string, string> = {
        'error': '/sounds/notifications/error.mp3',
        'info': '/sounds/notifications/info.mp3',
        'success': '/sounds/notifications/success.mp3',
        'warning': '/sounds/notifications/warning.mp3'
    };

    const soundPath = soundMap[type];
    if (soundPath) {
        AudioService.playSound(soundPath, { volume: 0.5 });
    }
};

const { notifications } = useNotifications();
const { isInterfaceVisible } = useInterfaceVisibility();

const top = computed(() => isInterfaceVisible('HudInterface') ? '14rem' : '1rem');

// Preload notification sounds when component mounts
onMounted(() => {
    AudioService.preloadSounds(notificationSounds);
});

onUnmounted(() => {
    notificationSounds.forEach(sound => {
        AudioService.unloadSound(sound);
    });
});

useRageEvent('addNotification', (data: NotificationData) => {
    addNotification(data.title, data.message, data.type, data.icon, data.iconFillOpacity);
    playNotificationSound(data.type);
});
</script>
