<template>
  <div class="favorites-page">
    <div class="fav-container">
      <header class="page-header">
        <div class="header-left">
          <el-button @click="router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </el-button>
          <div class="title-group">
            <h2>⭐ 我的收藏</h2>
            <p class="subtitle">收藏的课程内容都在这里</p>
          </div>
        </div>
        <div v-if="userStore.isLoggedIn && favorites.length > 0" class="header-right">
          <span class="count-badge">共 {{ favorites.length }} 个收藏</span>
        </div>
      </header>

      <div v-if="!userStore.isLoggedIn" class="login-tip-card">
        <el-icon :size="48" color="#f59e0b"><Lock /></el-icon>
        <h3>请先登录查看收藏</h3>
        <p>登录后可以收藏喜欢的课程内容</p>
        <el-button type="primary" @click="$router.push('/login')">立即登录</el-button>
      </div>

      <div v-if="loading" class="loading-wrap">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="favorites.length === 0 && userStore.isLoggedIn" class="empty-state">
        <p>还没有收藏任何课程</p>
        <el-button type="primary" @click="$router.push('/learn')">去学习中心逛逛</el-button>
      </div>

      <div v-else class="fav-grid">
        <div
          v-for="item in favorites"
          :key="item.id"
          class="fav-card"
          @click="goToCourse(item.courseKey)"
        >
          <div class="fav-card-icon">{{ getIcon(item.courseKey) }}</div>
          <div class="fav-card-info">
            <h3>{{ item.courseName || item.courseKey }}</h3>
            <span class="fav-time">收藏于 {{ formatTime(item.createdAt) }}</span>
          </div>
          <el-icon class="fav-card-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ArrowLeft, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getFavoriteList } from '@/api/favorite'
import type { FavoriteItem } from '@/api/favorite'

const router = useRouter()
const userStore = useUserStore()
const favorites = ref<FavoriteItem[]>([])
const loading = ref(false)

const courseRouteMap: Record<string, string> = {
  html: 'learn-html',
  css: 'learn-css',
  javascript: 'learn-javascript',
  vue3: 'learn-vue3',
  react: 'learn-react',
  typescript: 'learn-typescript',
  tailwindcss: 'learn-tailwindcss'
}

const courseIconMap: Record<string, string> = {
  html: '🌐', css: '🎨', javascript: '⚡',
  vue3: '💚', react: '⚛️', typescript: '🔷', tailwindcss: '🌊'
}

function getIcon(key: string): string {
  return courseIconMap[key] || '📚'
}

function goToCourse(courseKey: string) {
  const routeName = courseRouteMap[courseKey]
  if (routeName) {
    router.push({ name: routeName })
  }
}

function formatTime(time: string) {
  if (!time) return ''
  return new Date(time).toLocaleDateString('zh-CN')
}

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  loading.value = true
  try {
    const res: any = await getFavoriteList()
    favorites.value = res?.data || []
  } catch {}
  loading.value = false
})
</script>

<style scoped>
.favorites-page {
  min-height: 100%;
  background: #f8fafc;
}
.dark .favorites-page { background: #111; }

.fav-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}
.dark .page-header { background: #1e1e1e; border: 1px solid #333; }

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}
.back-btn:hover {
  background: #f0f9ff;
  color: #3b82f6;
  transform: translateX(-2px);
}
.dark .back-btn:hover { background: #1e3a8a; }

.title-group h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}
.dark .title-group h2 { color: #f3f4f6; }

.subtitle {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.count-badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}
.dark .count-badge { background: rgba(251, 191, 36, 0.15); color: #d97706; }

.login-tip-card {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.dark .login-tip-card { background: #1e1e1e; }
.login-tip-card h3 {
  color: #1f2937;
  margin: 16px 0 8px;
  font-size: 1.25rem;
}
.dark .login-tip-card h3 { color: #f3f4f6; }
.login-tip-card p {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.loading-wrap { padding: 24px 0; }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.dark .empty-state { background: #1e1e1e; }
.empty-state p { font-size: 1rem; margin-bottom: 16px; color: #6b7280; }

.fav-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fav-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.25s ease;
}
.dark .fav-card { background: #1e1e1e; box-shadow: none; border: 1px solid #333; }
.fav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59,130,246,0.15);
}

.fav-card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 12px;
  font-size: 22px;
  flex-shrink: 0;
}
.dark .fav-card-icon { background: rgba(59,130,246,0.15); }

.fav-card-info {
  flex: 1;
  min-width: 0;
}
.fav-card-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
}
.dark .fav-card-info h3 { color: #e5e7eb; }
.fav-time {
  font-size: 0.82rem;
  color: #9ca3af;
}

.fav-card-arrow {
  color: #9ca3af;
  font-size: 18px;
  flex-shrink: 0;
}
.fav-card:hover .fav-card-arrow { color: #3b82f6; }
</style>
