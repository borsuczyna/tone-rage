<script lang="ts">
  import { onMount } from 'svelte';
  import { interfaceVisibility } from 'src/Hooks/InterfaceVisibilityStore';
  import { addNotification, notifications } from 'src/Hooks/NotificationsStore';
  import styles from './Styles/NotificationsInterface.module.css';
  import Notification from './Components/Notifications/Notification.svelte';
  import { useRageEvent } from 'src/Hooks/RageEventStore';
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

  $: top = $interfaceVisibility['HudInterface'] ? '14rem' : '1rem';

  onMount(() => {
    AudioService.preloadSounds(notificationSounds);
    
    // Cleanup on unmount
    return () => {
        notificationSounds.forEach(sound => {
            AudioService.unloadSound(sound);
        });
    };
  });

  useRageEvent('addNotification', (data: NotificationData) => {
      addNotification(data.title, data.message, data.type, data.icon, data.iconFillOpacity);
      playNotificationSound(data.type);
  });
</script>

<div class={styles.main} style="top: {top}">
  {#each $notifications as notification (notification.key)}
    <Notification data={notification} />
  {/each}
</div>
