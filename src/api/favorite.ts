import request from './request'

export interface FavoriteItem {
  id: number
  userId: number
  courseKey: string
  courseName: string
  createdAt: string
}

export function getFavoriteList() {
  return request.get('/favorite/list')
}

export function toggleFavorite(courseKey: string, courseName: string) {
  return request.post('/favorite/toggle', { courseKey, courseName })
}

export function checkFavorite(courseKey: string) {
  return request.get(`/favorite/check/${courseKey}`)
}
