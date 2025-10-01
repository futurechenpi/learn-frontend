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
                <el-avatar :size="32" class="mr-2">{{ userStore.userInfo?.userName?.charAt(0) }}</el-avatar>
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
      <div class="container mx-auto px-4 py-8">
        <!-- 欢迎区域 -->
        <section class="welcome-section text-center py-20">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-text">🚀 全新升级</span>
            </div>
            <h2 class="text-5xl font-bold text-white mb-6 leading-tight">
              欢迎来到
              <span class="gradient-text">前端学习网站</span>
            </h2>
            <p class="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              从零开始学习前端技术，掌握HTML、CSS、JavaScript、Vue3、React、TypeScript和TailwindCSS
              <br>让编程学习变得简单有趣
            </p>
            
            <div v-if="!userStore.isLoggedIn" class="hero-actions">
              <el-button type="primary" size="large" @click="goToRegister" class="hero-btn primary">
                <el-icon><User /></el-icon>
                立即注册
              </el-button>
              <el-button size="large" @click="goToLogin" class="hero-btn secondary">
                <el-icon><Key /></el-icon>
                已有账号？登录
              </el-button>
            </div>
            
            <div v-else class="hero-actions">
              <el-button type="primary" size="large" @click="goToLearn" class="hero-btn primary">
                <el-icon><Reading /></el-icon>
                开始学习之旅
              </el-button>
            </div>
          </div>
          
          <!-- 装饰性元素 -->
          <div class="hero-decoration">
            <div class="floating-element element-1">💻</div>
            <div class="floating-element element-2">🎨</div>
            <div class="floating-element element-3">⚡</div>
            <div class="floating-element element-4">🚀</div>
          </div>
        </section>

        <!-- 学习路径 -->
        <section class="learning-path py-20">
          <div class="learning-path-container">
            <div class="section-header">
              <h3 class="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
                学习路径
              </h3>
              <p class="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                系统化的学习体系，从基础到进阶，助你成为前端开发专家
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <div 
                v-for="(course, index) in courses" 
                :key="course.name"
                class="course-card group"
                :class="{ 'locked': !userStore.isLoggedIn && index > 2 }"
                @click="goToCourse(course.name, index)"
              >
                <div class="card-inner">
                  <div class="card-header">
                    <div class="course-icon">{{ course.icon }}</div>
                    <div class="difficulty-badge" :class="getDifficultyClass(course.difficulty)">
                      {{ course.difficulty }}
                    </div>
                  </div>
                  <div class="card-content">
                    <h4 class="course-title">{{ course.name }}</h4>
                    <p class="course-description">{{ course.description }}</p>
                  </div>
                  <div class="card-footer">
                    <div class="progress-indicator">
                      <div class="progress-bar" :style="{ width: getProgress(index) }"></div>
                    </div>
                    <span class="progress-text">{{ getProgress(index) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 特色功能 -->
        <section class="features py-20">
          <div class="section-header">
            <h3 class="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
              特色功能
            </h3>
            <p class="text-lg text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
              我们提供最优质的学习体验，让编程学习变得简单高效
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div class="feature-item group">
              <div class="feature-icon">
                <div class="icon-bg">🤖</div>
              </div>
              <div class="feature-content">
                <h4 class="feature-title">AI智能答疑</h4>
                <p class="feature-description">
                  遇到问题？AI助手随时为您解答，让学习更高效，24小时在线支持
                </p>
                <div class="feature-highlight">智能推荐学习路径</div>
              </div>
            </div>
            
            <div class="feature-item group">
              <div class="feature-icon">
                <div class="icon-bg">📚</div>
              </div>
              <div class="feature-content">
                <h4 class="feature-title">循序渐进</h4>
                <p class="feature-description">
                  从基础到进阶，系统化的学习路径，适合不同水平的学习者
                </p>
                <div class="feature-highlight">个性化学习计划</div>
              </div>
            </div>
            
            <div class="feature-item group">
              <div class="feature-icon">
                <div class="icon-bg">🎨</div>
              </div>
              <div class="feature-content">
                <h4 class="feature-title">个性化主题</h4>
                <p class="feature-description">
                  支持暗色模式和自定义主题，打造专属学习环境
                </p>
                <div class="feature-highlight">护眼模式</div>
              </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { checkAdmin } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const canSeeAdmin = ref(false)

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
      canSeeAdmin.value = !!res.data?.hasPermission
    } catch {
      canSeeAdmin.value = false
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

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

const getProgress = (index: number) => {
  if (!userStore.isLoggedIn && index > 2) {
    return '0%'
  }
  // 模拟学习进度
  const progress = [85, 70, 45, 20, 10, 5, 0]
  return `${progress[index]}%`
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark .home {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
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

/* Learning Path Container */
.learning-path-container {
  background: white;
  border-radius: 24px;
  padding: 48px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 0 16px;
}

.dark .learning-path-container {
  background: #2d3748;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Course Cards */
.course-card {
  position: relative;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.dark .course-card {
  background: #374151;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid #4b5563;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.dark .course-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: #4b5563;
}

.course-card.locked {
  opacity: 0.6;
  filter: grayscale(0.3);
}

.course-card.locked {
  cursor: not-allowed;
}

.course-card.locked:hover {
  transform: none;
}

.card-inner {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.course-icon {
  font-size: 3rem;
  line-height: 1;
}

.difficulty-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.dark .course-title {
  color: #f9fafb;
}

.course-description {
  color: #6b7280;
  line-height: 1.5;
}

.dark .course-description {
  color: #d1d5db;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-indicator {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.dark .progress-indicator {
  background: #374151;
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
  color: #9ca3af;
}

/* Feature Items */
.feature-item {
  text-align: center;
  padding: 32px 24px;
  background: white;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.dark .feature-item {
  background: #2d3748;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-item:hover::before {
  transform: scaleX(1);
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.dark .feature-item:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  margin-bottom: 24px;
}

.icon-bg {
  display: inline-block;
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.feature-item:hover .icon-bg {
  transform: scale(1.1) rotate(5deg);
}

.feature-content {
  margin-bottom: 16px;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.dark .feature-title {
  color: #f9fafb;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.dark .feature-description {
  color: #d1d5db;
}

.feature-highlight {
  display: inline-block;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

</style>

