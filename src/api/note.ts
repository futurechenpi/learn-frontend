import request from './request'

export interface NoteItem {
  id: number
  userId: number
  courseKey: string
  lessonStep: number | null
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function getNotes(userId: number, courseKey?: string) {
  return request.get<NoteItem[]>('/note/list', { params: { userId, ...(courseKey ? { courseKey } : {}) } })
}

export function addNote(data: { courseKey: string; lessonStep?: number; title?: string; content: string }) {
  return request.post<NoteItem>('/note/add', data)
}

export function updateNote(noteId: number, data: { title?: string; content: string }) {
  return request.put<NoteItem>(`/note/${noteId}`, data)
}

export function deleteNote(noteId: number) {
  return request.delete(`/note/${noteId}`)
}
