import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAIAssistantStore = defineStore('aiAssistant', () => {
  const STORAGE_KEY = 'aiAssistantState'

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        return {
          isMinimized: saved.isMinimized ?? false,
          isExpanded: saved.isExpanded ?? false
        }
      }
    } catch (e) {
      console.error('加载AI助手状态失败:', e)
    }
    return { isMinimized: false, isExpanded: false }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isMinimized: isMinimized.value,
        isExpanded: isExpanded.value
      }))
    } catch (e) {
      console.error('保存AI助手状态失败:', e)
    }
  }

  const isMinimized = ref(loadState().isMinimized)
  const isExpanded = ref(loadState().isExpanded)

  function toggleMinimized() {
    isMinimized.value = !isMinimized.value
    if (!isMinimized.value) {
      isExpanded.value = true
    }
    saveState()
  }

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
    saveState()
  }

  function resetToDefault() {
    isMinimized.value = false
    isExpanded.value = false
    saveState()
  }

  function syncFromStorage() {
    const state = loadState()
    isMinimized.value = state.isMinimized
    isExpanded.value = state.isExpanded
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        syncFromStorage()
      }
    })
  }

  return {
    isMinimized,
    isExpanded,
    toggleMinimized,
    toggleExpanded,
    resetToDefault,
    syncFromStorage
  }
})
