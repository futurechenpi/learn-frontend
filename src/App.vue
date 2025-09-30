<template>
  <div id="app" :class="themeClass">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const userStore = useUserStore()

const { themeClass } = themeStore

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  // 初始化用户信息
  userStore.initUserInfo()
})
</script>

<style scoped>
#app {
  height: 100vh;
  transition: all 0.3s ease;
}
</style>

