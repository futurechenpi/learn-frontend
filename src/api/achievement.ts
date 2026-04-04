import request from './request'

export interface AchievementItem {
  id: number
  code: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export function getMyAchievements(userId: number) {
  return request.get<AchievementItem[]>('/achievement/my', { params: { userId } })
}

export function checkAchievements(userId: number) {
  return request.post('/achievement/check', null, { params: { userId } })
}

export function getAllAchievements() {
  return request.get('/achievement/list')
}
