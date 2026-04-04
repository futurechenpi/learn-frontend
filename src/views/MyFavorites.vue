<template>
  <div class="favorites-page">
    <div class="fav-container">
      <div class="fav-header">
        <el-button text @click="router.back()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        <h2>⭐ 我的收藏</h2>
        <p v-if="!userStore.isLoggedIn" class="login-tip">
          请先<router-link to="/login">登录</router-link>后查看收藏
        </p>
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
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
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

.fav-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}
.dark .fav-header h2 { color: #f3f4f6; }

.login-tip {
  color: #6b7280;
  font-size: 0.95rem;
}
.login-tip a { color: #3b82f6; text-decoration: none; }
.login-tip a:hover { text-decoration: underline; }

.loading-wrap { padding: 24px 0; }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}
.empty-state p { font-size: 1rem; margin-bottom: 16px; }

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
