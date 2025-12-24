<script lang="ts">
  import { userInfo, workInfo } from 'src/Hooks/UserInfoStore';
  import styles from './Styles/HudInterface.module.css';
  import translate from '@shared/Translation/Translation';
  import { formatMoney } from '@shared/MoneyHelper';

  // Calculate health bar offset (100% health = 0 offset, 0% health = full circumference)
  const healthCircumference = 471;
  $: healthOffset = healthCircumference - (healthCircumference * $userInfo.health * 0.38) / 100;
  $: expOffset = healthCircumference - (healthCircumference * $userInfo.exp * -0.38) / 100;
</script>

{#if $userInfo.username}
  <div class={styles.main}>
    <div class={styles.playerInfo}>
      <div class={styles.playerDetails}>
        <span class={styles.username}>{$userInfo.username}</span>
        <span class={styles.money}>{formatMoney($userInfo.money)}</span>
      </div>
      <div class={styles.avatarContainer}>
        <svg class={styles.backgroundRing} viewBox="0 0 200 200">
          <defs>
            <linearGradient id="expGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00ffff" />
              <stop offset="50%" stop-color="#8b5cf6" />
              <stop offset="100%" stop-color="#ef4444" />
            </linearGradient>
          </defs>
          <circle
            class={styles.backgroundBar}
            cx="100"
            cy="100"
            r="75"
          />
          <circle
            class={styles.healthBar}
            cx="100"
            cy="100"
            r="75"
            style="stroke-dashoffset: {healthOffset}"
          />
          <circle
            class={styles.expBarGlow}
            cx="100"
            cy="100"
            r="75"
            style="stroke-dashoffset: {expOffset}"
          />
          <circle
            class={styles.expBar}
            cx="100"
            cy="100"
            r="75"
            style="stroke-dashoffset: {expOffset}"
          />
        </svg>
        <img
          src={$userInfo.avatar}
          class={styles.avatar}
          alt="Avatar"
        />
        <div class={styles.levelBadge}>
          <span>{$userInfo.level}</span>
        </div>
      </div>
    </div>
    {#if $workInfo.currentJob}
      <div class={styles.jobInfo}>
        <div class={styles.jobTitle}>{$workInfo.currentJob} {translate('hud.job.work')}</div>
        <div class={styles.jobStats}>
          <div class={styles.jobStat}>
            <span class={styles.jobLabel}>{translate('hud.job.workingTime')}</span>
            <span class={styles.jobValue}>{$workInfo.workTimeElapsed}</span>
          </div>
          <div class={styles.jobStat}>
            <span class={styles.jobLabel}>{translate('hud.job.earnedMoney')}</span>
            <span class={styles.jobValue}>${$workInfo.moneyEarned}</span>
          </div>
          <div class={styles.jobStat}>
            <span class={styles.jobLabel}>{translate('hud.job.averageEarnings')}</span>
            <span class={styles.jobValue}>${$workInfo.hourlyEarnings}/h</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
