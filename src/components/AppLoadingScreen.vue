<script setup lang="ts">
import logoUrl from "../assets/logo-pribe.png";

defineProps<{ progress: number }>();
</script>

<template>
  <div class="loading-screen">
    <img :src="logoUrl" alt="PRIBE STUDIO" class="loading-logo" />
    <p class="loading-title">PRIBE STUDIO</p>
    <div class="loading-bar-track">
      <div class="loading-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="loading-percent">{{ progress }}%</p>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.loading-logo {
  width: 90px;
  height: 90px;
  border-radius: 9999px;
  object-fit: cover;
  animation: pulse 1.4s ease-in-out infinite;
}
.loading-title {
  font-weight: 800;
  color: #b70112;
  letter-spacing: 0.05em;
  font-size: 14px;
}
.loading-bar-track {
  width: 200px;
  height: 6px;
  border-radius: 999px;
  background: #f3f4f6;
  overflow: hidden;
}
.loading-bar-fill {
  height: 100%;
  background: #b70112;
  transition: width 0.2s ease;
}
.loading-percent {
  font-size: 11px;
  color: #9ca3af;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.85;
  }
}
</style>
