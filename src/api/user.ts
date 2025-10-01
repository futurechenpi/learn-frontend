/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-09-30 09:52:09
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2025-09-30 18:29:02
 * @FilePath: \learn-frontend\src\api\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from './request'

// 用户登录注册接口类型定义
export interface LoginParams {
  userName: string
  password: string
}

export interface RegisterParams {
  userName: string
  password: string
}

export interface UserInfo {
  userId: number
  userName: string
  password: string
  email?: string
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    success: boolean
    message: string
    userInfo: UserInfo
    token: string
  }
}

export interface RegisterResponse {
  code: number
  message: string
  data: boolean
}

export interface ChangePasswordParams {
  userId: string
  oldPassword: string
  newPassword: string
}

export interface UpdateUsernameParams {
  userId: string
  userName: string
}

export interface UpdateEmailParams {
  userId: string
  email: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 权限校验响应
export interface PermissionData {
  hasPermission: boolean
  message: string
  userInfo: UserInfo | null
  requiredRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

// 权限相关接口
export const checkAdmin = () => request.get<ApiResponse<PermissionData>>('/auth/check-admin')
export const validateSuperAdmin = () => request.post<ApiResponse<PermissionData>>('/auth/validate-super-admin')
export const validateAdmin = () => request.post<ApiResponse<PermissionData>>('/auth/validate-admin')
export const validateRole = (requiredRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN') =>
  request.post<ApiResponse<PermissionData>>(`/auth/validate/${requiredRole}`)

// 统计相关
export const reportVisit = (key: string) => request.post<ApiResponse<boolean>>(`/stats/visit`, null, { params: { key } })
export const getTotalCount = () => request.get<ApiResponse<number>>('/stats/count')
export const getRangeCountByKey = (startDate: string, endDate: string, key: string) =>
  request.get<ApiResponse<Array<{ date: string; count: number }>>>('/stats/count/range', { params: { startDate, endDate, key } })
export const getRangeTotalCount = (startDate: string, endDate: string) =>
  request.get<ApiResponse<Array<{ date: string; count: number }>>>('/stats/count/range-total', { params: { startDate, endDate } })

// 用户登录
export const login = (params: LoginParams): Promise<LoginResponse> => {
  return request.post('/user/login', params)
}

// 用户注册
export const register = (params: RegisterParams): Promise<RegisterResponse> => {
  return request.post('/user/register', params)
}

// 修改密码
export const changePassword = (params: ChangePasswordParams): Promise<ApiResponse<boolean>> => {
  return request.put('/user/change-password', params)
}

// 修改用户名
export const updateUsername = (params: UpdateUsernameParams): Promise<ApiResponse<UserInfo>> => {
  return request.put('/user/update-username', params)
}

// 修改邮箱
export const updateEmail = (params: UpdateEmailParams): Promise<ApiResponse<UserInfo>> => {
  return request.put('/user/update-email', params)
}

// 用户分页
export interface PageRequest {
  page?: number
  size?: number
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export const pageUsers = (params: PageRequest = { page: 0, size: 10 }) =>
  request.get<ApiResponse<PageResponse<UserInfo>>>('/user/page', { params })

// 用户CRUD
export interface AddUserParams { userName: string; password: string; email?: string }
export interface EditUserParams { userId: string; userName: string; password: string; email?: string }

export const addUser = (params: AddUserParams) => request.post<ApiResponse<UserInfo>>('/user/adduser', params)
export const editUser = (params: EditUserParams) => request.put<ApiResponse<UserInfo>>('/user/edituser', params)
export const deleteUser = (userId: string) => request.delete<ApiResponse<null>>(`/user/${userId}`)

// 修改角色（限制同级不可改，前端在调用前判断）
export interface UpdateRoleParams { userId: number; role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null }
export const updateUserRole = (params: UpdateRoleParams) => request.put<ApiResponse<UserInfo>>('/user/update-role', params)

