import request from './request'

export interface WrongQuestionItem {
  id: number
  userId: number
  courseKey: string
  lessonStep: number | null
  lessonTitle: string
  wrongCode: string
  note: string
  status: number
  masteredAt: string | null
  attempts: number
  createdAt: string
}

export function getWrongQuestions(userId: number) {
  return request.get<WrongQuestionItem[]>('/wrong-question/list', { params: { userId } })
}

export function getMasteredQuestions(userId: number) {
  return request.get<WrongQuestionItem[]>('/wrong-question/mastered/list', { params: { userId } })
}

export function getMasteredCount(userId: number) {
  return request.get<number>('/wrong-question/mastered/count', { params: { userId } })
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

export function markAsMastered(id: number) {
  return request.put(`/wrong-question/${id}/master`)
}

export function deleteWrongQuestion(id: number) {
  return request.delete(`/wrong-question/${id}`)
}

export function deleteMasteredQuestion(id: number) {
  return request.delete(`/wrong-question/mastered/${id}`)
}

export function clearAllMastered() {
  return request.delete('/wrong-question/mastered/clear')
}
