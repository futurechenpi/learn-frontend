import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const isDark = ref<boolean>(localStorage.getItem('theme') === 'dark')
  const primaryColor = ref<string>(localStorage.getItem('primaryColor') || '#3b82f6')

  // 计算属性
  const themeClass = computed(() => isDark.value ? 'dark' : 'light')

  // 切换暗色模式
  const toggleDark = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    updateTheme()
  }

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    localStorage.setItem('primaryColor', color)
    updateTheme()
  }

  // 更新主题
  const updateTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // 设置CSS变量
    html.style.setProperty('--el-color-primary', primaryColor.value)
  }

  // 初始化主题
  const initTheme = () => {
    updateTheme()
  }

  return {
    isDark,
    primaryColor,
    themeClass,
    toggleDark,
    setPrimaryColor,
    initTheme
  }
})

