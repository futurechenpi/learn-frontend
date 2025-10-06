<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <el-button 
          type="primary" 
          text 
          @click="goBack"
          class="back-btn"
        >
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="page-title">个人资料</h1>
      </div>

      <!-- 用户信息卡片 -->
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><User /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        
        <div class="user-info">
          <!-- 头像与上传 -->
          <div class="avatar-row">
            <div class="avatar-box">
              <el-avatar :size="84" :src="avatarUrl || undefined">
                {{ userStore.userInfo?.userName?.charAt(0) || '?' }}
              </el-avatar>
            </div>
            <div class="avatar-actions">
              <el-upload
                :show-file-list="false"
                :http-request="onUploadAvatar"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary" :loading="avatarUploading">
                  {{ avatarUploading ? '上传中...' : '上传头像' }}
                </el-button>
              </el-upload>
              <div class="avatar-hint">支持 JPG/PNG/GIF，≤ 2MB</div>
            </div>
          </div>

          <div class="info-item">
            <label class="info-label">用户ID</label>
            <span class="info-value">{{ userStore.userInfo?.userId || '-' }}</span>
          </div>
          <div class="info-item">
            <label class="info-label">用户名</label>
            <div class="info-value-with-action">
              <span class="info-value">{{ userStore.userInfo?.userName || '-' }}</span>
              <el-button 
                type="primary" 
                text 
                @click="showEditUsernameDialog"
                class="edit-btn"
              >
                <el-icon><Edit /></el-icon>
                修改
              </el-button>
            </div>
          </div>
          <div class="info-item">
            <label class="info-label">邮箱</label>
            <div class="info-value-with-action">
              <span class="info-value">{{ userStore.userInfo?.email || '未绑定' }}</span>
              <el-button 
                type="primary" 
                text 
                @click="showEditEmailDialog"
                class="edit-btn"
              >
                <el-icon><Edit /></el-icon>
                {{ userStore.userInfo?.email ? '修改' : '绑定' }}
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 安全设置卡片 -->
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Lock /></el-icon>
            <span>安全设置</span>
          </div>
        </template>
        
        <div class="security-actions">
          <div class="action-item">
            <div class="action-info">
              <h4 class="action-title">修改密码</h4>
              <p class="action-desc">定期修改密码，保护账户安全</p>
            </div>
            <el-button 
              type="primary" 
              @click="showChangePasswordDialog"
              class="action-btn"
            >
              <el-icon><Key /></el-icon>
              修改密码
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 修改用户名对话框 -->
    <el-dialog
      v-model="editUsernameDialogVisible"
      title="修改用户名"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="usernameFormRef"
        :model="usernameForm"
        :rules="usernameRules"
        label-width="80px"
      >
        <el-form-item label="新用户名" prop="userName">
          <el-input
            v-model="usernameForm.userName"
            placeholder="请输入新用户名"
            clearable
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUsernameDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="updateUsername"
            :loading="usernameLoading"
          >
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改邮箱对话框 -->
    <el-dialog
      v-model="editEmailDialogVisible"
      :title="userStore.userInfo?.email ? '修改邮箱' : '绑定邮箱'"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="emailFormRef"
        :model="emailForm"
        :rules="emailRules"
        label-width="80px"
      >
        <el-form-item label="邮箱地址" prop="email">
          <el-input
            v-model="emailForm.email"
            placeholder="请输入邮箱地址"
            clearable
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editEmailDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="updateEmail"
            :loading="emailLoading"
          >
            {{ userStore.userInfo?.email ? '确认修改' : '确认绑定' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordDialogVisible"
      title="修改密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changePasswordDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="changePassword"
            :loading="passwordLoading"
          >
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { 
  ArrowLeft, 
  User, 
  Edit, 
  Lock, 
  Key 
} from '@element-plus/icons-vue'
import { 
  changePassword as changePasswordApi, 
  updateUsername as updateUsernameApi, 
  updateEmail as updateEmailApi,
  type ChangePasswordParams,
  type UpdateUsernameParams,
  type UpdateEmailParams,
  uploadAvatar,
  getAvatarUrl,
  getAvatarSignedUrl
} from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

// 对话框显示状态
const editUsernameDialogVisible = ref(false)
const editEmailDialogVisible = ref(false)
const changePasswordDialogVisible = ref(false)

// 加载状态
const usernameLoading = ref(false)
const emailLoading = ref(false)
const passwordLoading = ref(false)
const avatarUploading = ref(false)
const avatarUrl = ref<string>('')

// 表单引用
const usernameFormRef = ref<FormInstance>()
const emailFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

// 修改用户名表单
const usernameForm = reactive({
  userName: ''
})

// 修改邮箱表单
const emailForm = reactive({
  email: ''
})

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const usernameRules: FormRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const emailRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 显示修改用户名对话框
const showEditUsernameDialog = () => {
  usernameForm.userName = userStore.userInfo?.userName || ''
  editUsernameDialogVisible.value = true
}

// 显示修改邮箱对话框
const showEditEmailDialog = () => {
  emailForm.email = userStore.userInfo?.email || ''
  editEmailDialogVisible.value = true
}

// 显示修改密码对话框
const showChangePasswordDialog = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  changePasswordDialogVisible.value = true
}

// 修改用户名
const updateUsername = async () => {
  if (!usernameFormRef.value) return
  
  try {
    await usernameFormRef.value.validate()
    
    usernameLoading.value = true
    
    const params: UpdateUsernameParams = {
      userId: userStore.userInfo?.userId?.toString() || '',
      userName: usernameForm.userName
    }
    
    const response = await updateUsernameApi(params)
    
    if (response.code === 200) {
      ElMessage.success('用户名修改成功')
      userStore.setUserInfo(response.data)
      editUsernameDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '修改失败')
    }
  } catch (error) {
    console.error('修改用户名失败:', error)
    ElMessage.error('修改失败，请重试')
  } finally {
    usernameLoading.value = false
  }
}

// 修改邮箱
const updateEmail = async () => {
  if (!emailFormRef.value) return
  
  try {
    await emailFormRef.value.validate()
    
    emailLoading.value = true
    
    const params: UpdateEmailParams = {
      userId: userStore.userInfo?.userId?.toString() || '',
      email: emailForm.email
    }
    
    const response = await updateEmailApi(params)
    
    if (response.code === 200) {
      ElMessage.success(userStore.userInfo?.email ? '邮箱修改成功' : '邮箱绑定成功')
      userStore.setUserInfo(response.data)
      editEmailDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('修改邮箱失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    emailLoading.value = false
  }
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    
    passwordLoading.value = true
    
    const params: ChangePasswordParams = {
      userId: userStore.userInfo?.userId?.toString() || '',
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    }
    
    const response = await changePasswordApi(params)
    
    if (response.code === 200) {
      ElMessage.success('密码修改成功')
      changePasswordDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '修改失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改失败，请重试')
  } finally {
    passwordLoading.value = false
  }
}

// 头像：上传前校验
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('请上传图片文件')
  if (!isLt2M) ElMessage.error('图片大小不能超过 2MB')
  return isImage && isLt2M
}

// 头像：自定义上传
const onUploadAvatar = async (options: any) => {
  if (!userStore.userInfo?.userId) {
    ElMessage.error('请先登录')
    return
  }
  try {
    avatarUploading.value = true
    const file: File = options.file
    await uploadAvatar(userStore.userInfo.userId, file)
    ElMessage.success('头像上传成功')
    await fetchAvatar()
  } catch (e) {
    ElMessage.error('头像上传失败')
  } finally {
    avatarUploading.value = false
  }
}

// 拉取头像地址（优先预签名 URL，其次 key 原样）
const fetchAvatar = async () => {
  if (!userStore.userInfo?.userId) return
  try {
    // 1) 试图获取预签名 URL（私有桶推荐）
    const signed = await getAvatarSignedUrl(userStore.userInfo.userId)
    console.log(signed)
    if (signed?.data) {
      avatarUrl.value = signed.data as unknown as string
      return
    }
    // 2) 回退到获取 key：原样赋值（后端自行保证是可用 URL 或 key）
    const res = await getAvatarUrl(userStore.userInfo.userId)
    if (res && res.data) {
      avatarUrl.value = res.data as unknown as string
    }
  } catch (e) {
    // 静默失败
  }
}

onMounted(() => {
  fetchAvatar()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.page-title {
  color: white;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.profile-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-box {
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avatar-hint {
  font-size: 12px;
  color: #666;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
}

.info-value {
  color: #333;
  font-size: 16px;
}

.info-value-with-action {
  display: flex;
  align-items: center;
  gap: 12px;
}

.edit-btn {
  padding: 6px 12px;
  font-size: 14px;
}

.security-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.action-info {
  flex: 1;
}

.action-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.action-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.action-btn {
  padding: 10px 20px;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 深色主题适配 */
.dark .profile-page {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.dark .profile-card {
  background: #2d3748;
  border: 1px solid #4a5568;
}

.dark .card-header {
  color: #e2e8f0;
}

.dark .info-label {
  color: #a0aec0;
}

.dark .info-value {
  color: #e2e8f0;
}

.dark .action-item {
  background: #374151;
  border: 1px solid #4b5563;
}

.dark .action-title {
  color: #e2e8f0;
}

.dark .action-desc {
  color: #a0aec0;
}

.dark .info-item {
  border-bottom-color: #4b5563;
}
</style>
