<script lang="ts">
  import type { NotificationData } from '@shared/Models/NotificationData';
  import styles from '../../Styles/NotificationsInterface.module.css';
  import * as Icons from "lucide-svelte";
  import { NotificationType } from '@shared/Models/NotificationType';

  export let data: NotificationData;

  const defaultIcons: {
      [key in NotificationType]: string;
  } = {
      [NotificationType.Info]: 'Bell',
      [NotificationType.Warning]: 'AlertTriangle',
      [NotificationType.Error]: 'XCircle',
      [NotificationType.Success]: 'CheckCircle',
  }

  $: notificationClasses = [
      styles.notification,
      styles[data.type.toLowerCase()],
      data.hiding ? styles.hiding : ''
  ].filter(Boolean).join(' ');

  $: icon = data.icon ? data.icon : defaultIcons[data.type];
  $: iconFillOpacity = data.iconFillOpacity !== undefined ? data.iconFillOpacity : 0.1;
  $: IconComponent = (Icons as any)[icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())] || Icons.Bell;
  $: messageLines = data.message.split('\n');
</script>

<div class={styles.notificationWrapper}>
  <div class={notificationClasses}>
    <div class={styles.titleWrapper}>
      <svelte:component this={IconComponent} class={styles.title} fill="currentColor" fillOpacity={iconFillOpacity} size="1rem" />
      <span class={styles.title}>{data.title}</span>
    </div>
    <span class={styles.message}>
      {#each messageLines as line, index}
        <span>
          {line}
          {#if index < messageLines.length - 1}<br />{/if}
        </span>
      {/each}
    </span>
    <span class={styles.rightBar}></span>
  </div>
</div>
