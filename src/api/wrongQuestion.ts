import request from './request'

export interface WrongQuestionItem {
  id: number
  userId: number
  courseKey: string
  lessonStep: number | null
  lessonTitle: string
  wrongCode: string
  note: string
  createdAt: string
}

export function getWrongQuestions(userId: number) {
  return request.get<WrongQuestionItem[]>('/wrong-question/list', { params: { userId } })
}

export function addWrongQuestion(data: {
  courseKey: string
  lessonStep?: number
  lessonTitle?: string
  wrongCode?: string
  note?: string
}) {
  return request.post<WrongQuestionItem>('/wrong-question/add', data)
}

export function updateWrongQuestionNote(id: number, note: string) {
  request.put(`/wrong-question/${id}/note`, { note })
}

export function deleteWrongQuestion(id: number) {
  return request.delete(`/wrong-question/${id}`)
}
