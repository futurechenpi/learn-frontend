<template>
  <div class="learn-page">
    <!-- 头部 -->
    <header class="learn-header">
      <div class="header-content">
        <div class="header-left">
          <AppLogo :text="'前端学习中心'" />
        </div>

        <div class="header-center">
          <GlobalSearch />
        </div>

        <div class="header-right">
          <ThemeToggle />

          <UserDropdown :avatar-url="avatarUrl" />
        </div>
      </div>
    </header>

    <div class="learn-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <!-- 侧边栏头部 -->
        <div class="sidebar-header">
          <div class="sidebar-title">
            <span class="title-icon">📚</span>
            <span>课程目录</span>
          </div>
        </div>

        <!-- 课程列表 -->
        <nav class="course-nav">
          <div
            v-for="course in courseList"
            :key="course.key"
            class="course-item"
            :class="{ 'active': activeMenu === course.key }"
            @click="handleMenuSelect(course.key)"
          >
            <div class="course-item-left">
              <span class="course-emoji">{{ course.emoji }}</span>
              <span class="course-name">{{ course.name }}</span>
            </div>
            <div class="course-item-right">
              <div class="mini-progress" v-if="progressMap[course.key] > 0">
                <div class="mini-progress-bar" :style="{ width: getCoursePercent(course.key) + '%' }"></div>
              </div>
              <span class="course-percent" :class="{ done: getCoursePercent(course.key) >= 100 }">
                {{ getCoursePercent(course.key) }}%
              </span>
            </div>
          </div>
        </nav>

        <!-- 底部功能区 -->
        <div class="sidebar-footer">
          <div class="footer-divider"></div>
          <div class="footer-label">学习工具</div>
          <div class="tool-grid">
            <div class="tool-item" @click="router.push('/favorites')">
              <span class="tool-icon">⭐</span>
              <span class="tool-name">我的收藏</span>
            </div>
            <div class="tool-item" @click="router.push('/notes')">
              <span class="tool-icon">📝</span>
              <span class="tool-name">我的笔记</span>
            </div>
            <div class="tool-item" @click="router.push('/wrong-questions')">
              <span class="tool-icon">📕</span>
              <span class="tool-name">错题本</span>
            </div>
            <div class="tool-item tool-item--mastered" @click="router.push('/mastered')">
              <span class="tool-icon">🏆</span>
              <span class="tool-name">已掌握</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主要内容区域 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
    
    <!-- AI 助手 -->
    <AIAssistant />

    <!-- 浮动笔记面板 -->
    <FloatingNotePanel
      v-if="userStore.isLoggedIn"
      :course-key="noteCourseKey"
      :lesson-step="noteStep"
      :lesson-title="noteTitle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AppLogo from '@/components/AppLogo.vue'
import AIAssistant from '@/components/AIAssistant.vue'
import FloatingNotePanel from '@/components/FloatingNotePanel.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import { getAvatarSignedUrl, getAvatarUrl } from '@/api/user'
import { getUserProgress } from '@/api/progress'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = ref('html')
const avatarUrl = ref<string>('')
const progressMap = ref<Record<string, number>>({})

const courseTotals: Record<string, number> = { html:5, css:4, javascript:5, vue3:6, react:4, typescript:4, tailwindcss:4 }

const courseList = [
  { key: 'html', name: 'HTML', emoji: '🌐' },
  { key: 'css', name: 'CSS', emoji: '🎨' },
  { key: 'javascript', name: 'JavaScript', emoji: '⚡' },
  { key: 'vue3', name: 'Vue3', emoji: '💚' },
  { key: 'react', name: 'React', emoji: '⚛️' },
  { key: 'typescript', name: 'TypeScript', emoji: '🔷' },
  { key: 'tailwindcss', name: 'TailwindCSS', emoji: '🎯' }
]

function getCoursePercent(key: string) {
  const step = progressMap.value[key] || 0
  const total = courseTotals[key] || 1
  return Math.min(100, Math.round((step / total) * 100))
}

async function fetchProgress() {
  if (!userStore.isLoggedIn || !userStore.userInfo?.userId) {
    progressMap.value = {}
    return
  }
  try {
    const res = await getUserProgress(userStore.userInfo.userId)
    progressMap.value = res?.data || {}
  } catch {
    progressMap.value = {}
  }
}

const routeToCourseKey: Record<string, string> = {
  html: 'html', css: 'css', javascript: 'javascript',
  vue3: 'vue3', react: 'react', typescript: 'typescript', tailwindcss: 'tailwindcss'
}

const noteCourseKey = computed(() => {
  const name = route.name as string
  if (name === 'exercise-html') return 'html'
  if (name === 'exercise-css') return 'css'
  if (name === 'exercise-js') return 'javascript'
  const key = route.path.split('/learn/')[1]?.split('/')[0]
  return routeToCourseKey[key || ''] || ''
})

const noteStep = computed(() => {
  const step = route.params.step
  return step ? Number(step) : undefined
})

const noteTitle = computed(() => {
  const title = route.query.title as string
  return title || ''
})

// 根据当前路由设置激活的菜单项
onMounted(async () => {
  const path = route.path
  if (path.includes('/learn/')) {
    activeMenu.value = path.split('/learn/')[1] || 'html'
  }

  // 登录后拉取头像
  if (userStore.isLoggedIn) {
    try {
      const signed = await getAvatarSignedUrl(userStore.userInfo!.userId)
      if (signed?.data) {
        avatarUrl.value = signed.data as unknown as string
      } else {
        const r = await getAvatarUrl(userStore.userInfo!.userId)
        if (r?.data) avatarUrl.value = r.data as unknown as string
      }
    } catch {}
  }
  await fetchProgress()
})

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  router.push(`/learn/${index}`)
}

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
    } else {
      avatarUrl.value = ''
    }
  }
)
</script>

<style scoped>
.learn-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.dark .learn-page {
  background: #111;
}

.learn-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  z-index: 1000;
}

.dark .learn-header {
  background: #1e1e1e;
  border-bottom: 1px solid #333;
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 24px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.learn-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ========== 侧边栏 ========== */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.dark .sidebar {
  background: #161616;
  border-right: 1px solid #2a2a2a;
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
}

.dark .sidebar-header {
  border-bottom-color: #252525;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 0.3px;
}

.dark .sidebar-title {
  color: #e8e8e8;
}

.title-icon {
  font-size: 18px;
}

/* 课程导航 */
.course-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  margin-bottom: 3px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.course-item:hover {
  background: #f5f7fa;
}

.dark .course-item:hover {
  background: #222;
}

.course-item.active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12);
}

.dark .course-item.active {
  background: linear-gradient(135deg, rgba(79,70,229,0.18) 0%, rgba(67,56,202,0.12) 100%);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
}

.course-item-left {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.course-emoji {
  font-size: 19px;
  line-height: 1;
  flex-shrink: 0;
  width: 26px;
  text-align: center;
}

.course-name {
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.dark .course-name {
  color: #d1d5db;
}

.course-item.active .course-name {
  color: #4338ca;
  font-weight: 600;
}

.dark .course-item.active .course-name {
  color: #a5b4fc;
}

.course-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.mini-progress {
  width: 40px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.dark .mini-progress {
  background: #333;
}

.mini-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.4s ease;
}

.course-percent {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  min-width: 30px;
  text-align: right;
}

.course-percent.done {
  color: #22c55e;
}

/* 底部功能区 */
.sidebar-footer {
  padding: 14px 16px 18px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.dark .sidebar-footer {
  border-top-color: #252525;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin-bottom: 12px;
}

.dark .footer-divider {
  background: linear-gradient(90deg, transparent, #333, transparent);
}

.footer-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding-left: 2px;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12.5px;
  color: #6b7280;
  font-weight: 500;
}

.tool-item:hover {
  background: #fefce8;
  color: #ca8a04;
}

.dark .tool-item:hover {
  background: rgba(234,179,8,0.08);
  color: #facc15;
}

.tool-item--mastered:hover {
  background: #f0fdf4;
  color: #16a34a;
}

.dark .tool-item--mastered:hover {
  background: rgba(34,197,94,0.08);
  color: #4ade80;
}

.tool-icon {
  font-size: 15px;
  line-height: 1;
}

.tool-name {
  white-space: nowrap;
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f0f2f5;
}

.dark .main-content {
  background: #111;
}
</style>

