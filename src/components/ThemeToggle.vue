<template>
  <div class="theme-toggle">
    <el-button 
      :icon="isDark ? 'Sunny' : 'Moon'" 
      circle 
      @click="toggleDark"
      class="toggle-button"
      :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    />
    
    <!-- 主题色选择器 -->
    <el-dropdown @command="handleColorChange" class="color-picker">
      <el-button circle class="color-button" :style="{ borderColor: primaryColor }">
        <div class="color-dot" :style="{ backgroundColor: primaryColor }"></div>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="color in themeColors" 
            :key="color.value"
            :command="color.value"
            class="color-option"
          >
            <div class="color-preview" :style="{ backgroundColor: color.value }"></div>
            <span>{{ color.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { isDark, primaryColor } = storeToRefs(themeStore)
const { toggleDark, setPrimaryColor } = themeStore

const themeColors = [
  { name: '蓝色', value: '#3b82f6' },
  { name: '绿色', value: '#10b981' },
  { name: '紫色', value: '#8b5cf6' },
  { name: '红色', value: '#ef4444' },
  { name: '橙色', value: '#f59e0b' },
  { name: '粉色', value: '#ec4899' },
  { name: '青色', value: '#06b6d4' },
  { name: '灰色', value: '#6b7280' }
]

const handleColorChange = (color: string) => {
  setPrimaryColor(color)
}
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-button {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  transition: all 0.3s ease;
}

.dark .toggle-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.toggle-button:hover {
  transform: scale(1.1);
}

.color-button {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  padding: 8px;
  width: 32px;
  height: 32px;
}

.dark .color-button {
  background: rgba(255, 255, 255, 0.1);
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
}

.dark :deep(.el-dropdown-menu__item:hover) {
  background-color: #374151;
}
</style>
