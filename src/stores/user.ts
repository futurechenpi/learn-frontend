import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  // 登录
  const login = (tokenValue: string, user: UserInfo) => {
    token.value = tokenValue
    userInfo.value = user
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 更新用户信息（用于资料修改后本地同步持久化）
  const setUserInfo = (user: UserInfo) => {
    userInfo.value = user
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      userInfo.value = JSON.parse(savedUserInfo)
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    setUserInfo,
    initUserInfo
  }
})

