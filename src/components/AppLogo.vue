<template>
  <div class="app-logo" @click="goHome">
    <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#logo-grad)"/>
      <path d="M12 16L18 20L12 24" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M28 16L22 20L28 24" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23 13L17 27" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3b82f6"/>
          <stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
    </svg>
    <span v-if="showText" class="logo-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

withDefaults(defineProps<{
  showText?: boolean
  text?: string
}>(), {
  showText: true,
  text: '前端学习网站'
})

const router = useRouter()
const goHome = () => router.push('/')
</script>

<style scoped>
.app-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s;
}
.app-logo:hover {
  opacity: 0.85;
}
.logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}
.dark .logo-text {
  background: linear-gradient(135deg, #60a5fa, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
