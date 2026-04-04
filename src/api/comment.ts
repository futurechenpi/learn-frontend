import request from './request'

export interface CommentItem {
  id: number
  userId: number
  userName: string
  avatarUrl: string | null
  courseKey: string
  content: string
  createdAt: string
}

export function getCommentList(courseKey: string) {
  return request.get(`/comment/list/${courseKey}`)
}

export function addComment(courseKey: string, content: string) {
  return request.post('/comment/add', { courseKey, content })
}

export function deleteComment(commentId: number) {
  return request.delete(`/comment/${commentId}`)
}

export function adminGetAllComments(courseKey?: string) {
  return request.get('/admin/comment/list', { params: courseKey ? { courseKey } : {} })
}

export function adminDeleteComment(commentId: number) {
  return request.delete(`/admin/comment/${commentId}`)
}
