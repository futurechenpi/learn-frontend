import request from './request'

export interface DashboardStats {
  courseProgress: Array<{
    courseKey: string
    currentStep: number
    totalSteps: number
    percent: number
  }>
  learningDays: number
  completedCourses: number
  totalCourses: number
  overallProgress: number
}

export function getDashboardStats(userId: number) {
  return request.get<DashboardStats>(`/progress/dashboard/${userId}`)
}
