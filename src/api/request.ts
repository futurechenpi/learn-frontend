/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-09-30 09:52:03
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2025-10-07 03:38:33
 * @FilePath: \learn-frontend\src\api\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    const userStore = useUserStore()
    const token = userStore.token
    
    // 排除无需携带token的接口：登录、注册、以及外部SDK(Coza不走此axios)
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

let isLoggingOut = false

function handleTokenExpired(message?: string) {
  if (isLoggingOut) return
  isLoggingOut = true
  const userStore = useUserStore()
  userStore.logout()
  ElMessage.error(message || '登录已过期，请重新登录')
  const currentPath = router.currentRoute.value.path
  if (currentPath !== '/login') {
    router.push('/login')
  }
  setTimeout(() => { isLoggingOut = false }, 3000)
}

// 响应拦截器
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

export default service

