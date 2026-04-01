<template>
  <div class="home">
    <!-- 头部 -->
    <header class="header" :class="{ 'scrolled': isScrolled }">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            前端学习网站
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 主题切换 -->
          <ThemeToggle />

          <!-- 用户下拉，与学习中心一致 -->
          <template v-if="userStore.isLoggedIn">
            <el-button type="primary" @click="goToLearn">开始学习</el-button>
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" class="mr-2" :src="avatarUrl || undefined">
                  {{ userStore.userInfo?.userName?.charAt(0) }}
                </el-avatar>
                {{ userStore.userInfo?.userName }}
                <el-icon class="ml-1"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item v-if="canSeeAdmin" command="admin">后台管理</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>

          <div v-else class="flex items-center space-x-2">
            <el-button @click="goToLogin">登录</el-button>
            <el-button type="primary" @click="goToRegister">注册</el-button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container mx-auto px-4 py-16">
        <!-- 欢迎区域 -->
        <section class="welcome-section text-center py-12">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            前端学习网站
          </h2>
          <p class="text-lg text-gray-600 dark:text-white/80 mb-8 max-w-2xl mx-auto">
            系统化学习前端技术，从基础到进阶
          </p>

          <div v-if="!userStore.isLoggedIn" class="hero-actions">
            <el-button type="primary" size="large" @click="goToRegister">
              立即开始
            </el-button>
            <el-button size="large" @click="goToLogin">
              登录
            </el-button>
          </div>

          <div v-else class="hero-actions">
            <el-button type="primary" size="large" @click="goToLearn">
              继续学习
            </el-button>
          </div>
        </section>

        <!-- 学习路径 -->
        <section class="learning-path py-16">
          <h3 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            课程列表
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="(course, index) in courses"
              :key="course.name"
              class="course-card"
              :class="{ 'locked': !userStore.isLoggedIn && index > 2 }"
              @click="goToCourse(course.name, index)"
            >
              <div class="course-icon">{{ course.icon }}</div>
              <h4 class="course-title">{{ course.name }}</h4>
              <p class="course-description">{{ course.description }}</p>
              <div class="card-footer">
                <div class="progress-indicator">
                  <div class="progress-bar" :style="{ width: getProgress(index) }"></div>
                </div>
                <span class="progress-text">{{ getProgress(index) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 特色功能 -->
        <section class="features py-16">
          <h3 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            为什么选择我们
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="feature-item">
              <div class="feature-icon">🤖</div>
              <h4 class="feature-title">AI智能答疑</h4>
              <p class="feature-description">
                AI助手24小时在线，随时解答您的问题
              </p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">📚</div>
              <h4 class="feature-title">系统化课程</h4>
              <p class="feature-description">
                从基础到进阶，循序渐进的学习路径
              </p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <h4 class="feature-title">实战练习</h4>
              <p class="feature-description">
                丰富的代码练习，边学边练，快速掌握技能
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Key, Reading, ArrowDown } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { checkAdmin, getAvatarSignedUrl, getAvatarUrl } from '@/api/user'
import { getUserProgress } from '@/api/progress'

const router = useRouter()
const userStore = useUserStore()
const canSeeAdmin = ref(false)
const avatarUrl = ref<string>('')

// 滚动状态
const isScrolled = ref(false)

// 滚动事件处理
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 生命周期钩子
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  // 判断是否显示“后台管理”
  if (userStore.isLoggedIn) {
    try {
      const res = await checkAdmin()
      console.log(res)
      canSeeAdmin.value = !!res?.data?.hasPermission
    } catch {
      canSeeAdmin.value = false
    }
    // 拉取头部头像（优先预签名，其次直接值）
    try {
      const signed = await getAvatarSignedUrl(userStore.userInfo!.userId)
      if (signed?.data) {
        avatarUrl.value = signed.data as unknown as string
      } else {
        const r = await getAvatarUrl(userStore.userInfo!.userId)
        if (r?.data) avatarUrl.value = r.data as unknown as string
      }
    } catch {}
    await fetchProgress()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 登录状态变化时刷新头像
watch(
  () => userStore.isLoggedIn,
  async (logged) => {
    if (logged && userStore.userInfo?.userId) {
      try {
        const signed = await getAvatarSignedUrl(userStore.userInfo.userId)
        if (signed?.data) {
          avatarUrl.value = signed.data as unknown as string
          return
        }
        const r = await getAvatarUrl(userStore.userInfo.userId)
        if (r?.data) avatarUrl.value = r.data as unknown as string
      } catch {}
      await fetchProgress()
    } else {
      avatarUrl.value = ''
      progressMap.value = {}
    }
  }
)

const courses = [
  {
    name: 'HTML',
    icon: '🌐',
    description: '网页结构基础',
    difficulty: '入门'
  },
  {
    name: 'CSS',
    icon: '🎨',
    description: '样式美化技术',
    difficulty: '入门'
  },
  {
    name: 'JavaScript',
    icon: '⚡',
    description: '动态交互编程',
    difficulty: '初级'
  },
  {
    name: 'Vue3',
    icon: '💚',
    description: '现代前端框架',
    difficulty: '中级'
  },
  {
    name: 'React',
    icon: '⚛️',
    description: '组件化开发',
    difficulty: '中级'
  },
  {
    name: 'TypeScript',
    icon: '🔷',
    description: '类型安全编程',
    difficulty: '中级'
  },
  {
    name: 'TailwindCSS',
    icon: '🎯',
    description: '实用优先CSS',
    difficulty: '初级'
  }
]

const progressMap = ref<Record<string, number>>({})

async function fetchProgress(){
  try{
    if (userStore.isLoggedIn && userStore.userInfo?.userId){
      const res = await getUserProgress(userStore.userInfo.userId)
      progressMap.value = res?.data || {}
    } else {
      progressMap.value = {}
    }
  }catch{ progressMap.value = {} }
}

const courseOrder = ['HTML','CSS','JavaScript','Vue3','React','TypeScript','TailwindCSS']
const courseKeyMap: Record<string, string> = { HTML:'html', CSS:'css', JavaScript:'javascript', Vue3:'vue3', React:'react', TypeScript:'typescript', TailwindCSS:'tailwindcss' }

const getProgress = (index: number) => {
  const courseName = courseOrder[index]
  const key = courseKeyMap[courseName]
  const totals: Record<string, number> = { html:5, css:4, javascript:5, vue3:6, react:4, typescript:4, tailwindcss:4 }
  if (!userStore.isLoggedIn && index > 2) return '0%'
  const step = progressMap.value[key] || 0
  const total = totals[key] || 0
  if (!total || !step) return '0%'
  return `${Math.min(100, Math.round((step/total)*100))}%`
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToLearn = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再开始学习')
    return
  }
  router.push('/learn')
}

const logout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      logout()
      router.push('/')
      break
  }
}

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case '入门':
      return 'difficulty-beginner'
    case '初级':
      return 'difficulty-elementary'
    case '中级':
      return 'difficulty-intermediate'
    case '高级':
      return 'difficulty-advanced'
    default:
      return 'difficulty-beginner'
  }
}

const goToCourse = (courseName: string, index: number) => {
  // 检查是否已登录，未登录用户只能访问前3个课程
  if (!userStore.isLoggedIn && index > 2) {
    ElMessage.warning('请先登录后访问更多课程')
    return
  }
  
  // 课程名称到路由的映射
  const courseRoutes: Record<string, string> = {
    'HTML': 'html',
    'CSS': 'css', 
    'JavaScript': 'javascript',
    'Vue3': 'vue3',
    'React': 'react',
    'TypeScript': 'typescript',
    'TailwindCSS': 'tailwindcss'
  }
  
  const routeName = courseRoutes[courseName]
  if (routeName) {
    router.push(`/learn/${routeName}`)
  } else {
    ElMessage.error('课程页面暂未开放')
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dark .home {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
  outline: none;
}

.user-info:hover {
  background: #f5f5f5;
}

.dark .user-info:hover {
  background: #404040;
}

.user-info :deep(.el-avatar) {
  border: none !important;
}

.user-info :deep(.el-avatar:hover) {
  border: none !important;
}

.dark .header {
  background: rgba(26, 32, 44, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.dark .header.scrolled {
  background: rgba(26, 32, 44, 0.8);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.main-content {
  flex: 1;
  padding-top: 64px; /* 为固定头部留出空间 */
}

/* Hero Section */
.welcome-section {
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 20px;
}

.badge-text {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.gradient-text {
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-btn.primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.hero-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.hero-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 装饰性元素 */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  top: 30%;
  right: 15%;
  animation-delay: 1.5s;
}

.element-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 3s;
}

.element-4 {
  bottom: 20%;
  right: 10%;
  animation-delay: 4.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

/* Course Cards */
.course-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dark .course-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.dark .course-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.course-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.course-card.locked:hover {
  transform: none;
}

.course-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  display: block;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.dark .card-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.progress-indicator {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.dark .progress-indicator {
  background: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  min-width: 40px;
}

.dark .progress-text {
  color: rgba(255, 255, 255, 0.7);
}

.difficulty-beginner {
  background: #dcfce7;
  color: #166534;
}

.difficulty-elementary {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty-intermediate {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-advanced {
  background: #fecaca;
  color: #991b1b;
}

.dark .difficulty-beginner {
  background: #14532d;
  color: #bbf7d0;
}

.dark .difficulty-elementary {
  background: #1e3a8a;
  color: #93c5fd;
}

.dark .difficulty-intermediate {
  background: #78350f;
  color: #fde68a;
}

.dark .difficulty-advanced {
  background: #7f1d1d;
  color: #fca5a5;
}

.card-content {
  flex: 1;
  margin-bottom: 16px;
}

.course-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.dark .course-title {
  color: white;
}

.course-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.dark .course-description {
  color: rgba(255, 255, 255, 0.8);
}

/* Feature Items */
.feature-item {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dark .feature-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.dark .feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: block;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.dark .feature-title {
  color: white;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.875rem;
}

.dark .feature-description {
  color: rgba(255, 255, 255, 0.8);
}

</style>

