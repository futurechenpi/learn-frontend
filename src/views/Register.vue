<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <div class="form-header">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            创建账户
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            注册新账户开始学习之旅
          </p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form-content"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="registerForm.userName"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="w-full"
              :loading="loading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="form-footer">
          <p class="text-gray-600 dark:text-gray-400">
            已有账户？
            <el-link type="primary" @click="goToLogin">
              立即登录
            </el-link>
          </p>
          <el-link type="primary" @click="goToHome">
            返回首页
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()

const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  userName: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    const response = await register({
      userName: registerForm.userName,
      password: registerForm.password
    })
    
    if (response.data) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    }
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.dark .register-page {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dark .register-form {
  background: rgba(26, 32, 44, 0.95);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-form-content {
  margin-bottom: 24px;
}

.form-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>

