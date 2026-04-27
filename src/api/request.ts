/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-09-30 09:52:03
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2025-10-07 03:38:33
 * @FilePath: \learn-frontend\src\api\request.ts
 */
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

let isTokenExpired = false

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function handleTokenExpired(message?: string) {
  if (isTokenExpired) return
  isTokenExpired = true
  const userStore = useUserStore()
  userStore.logout()
  ElMessage.error(message || '登录已过期，请重新登录')
  const currentPath = router.currentRoute.value.path
  if (currentPath !== '/login') {
    router.push('/login')
  }
}

service.interceptors.request.use(
  (config: any) => {
    if (isTokenExpired) {
      return Promise.reject(new Error('TOKEN_EXPIRED'))
    }

    const userStore = useUserStore()
    const token = userStore.token
    const url: string = config.url || ''
    const isAuthFree = url.includes('/user/login') || url.includes('/user/register')

    if (!isAuthFree && token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    if (data.code !== 200 && data.code !== 0) {
      if (data.code === 401 || data.code === 40101) {
        handleTokenExpired(data.message)
        return Promise.reject(new Error('Unauthorized'))
      }
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }

    return data
  },
  (error) => {
    if (error.message === 'TOKEN_EXPIRED') {
      return Promise.reject(error)
    }

    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        handleTokenExpired(data?.message)
        return Promise.reject(new Error('Unauthorized'))
      }

      switch (status) {
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时')
    } else if (error.message !== 'Unauthorized') {
      ElMessage.error('网络错误')
    }

    return Promise.reject(error)
  }
)

export function resetTokenExpired() {
  isTokenExpired = false
}

export default service