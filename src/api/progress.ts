import request from '@/api/request'

export type CourseKey = 'html' | 'css' | 'javascript' | 'vue3' | 'react' | 'typescript' | 'tailwindcss'

export interface UserProgressRecord {
  userId: number
  course: CourseKey
  step: number
}

export interface ProgressMap {
  [key: string]: number
}

export function getUserProgress(userId: number) {
  // 返回形如 { code:200, message:'success', data: { html: 3, css: 1, ... } }
  return request.get<ProgressMap>(`/progress/${userId}`)
}

export function saveUserProgress(payload: UserProgressRecord) {
  return request.post<void>('/progress', payload)
}


