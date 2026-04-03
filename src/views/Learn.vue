<template>
  <div class="learn-page">
    <!-- 头部 -->
    <header class="learn-header">
      <div class="header-content">
        <div class="header-left">
          <el-button 
            type="primary" 
            text 
            @click="goHome"
            class="back-home-btn"
          >
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <h1 class="text-xl font-bold text-gray-800 dark:text-gray-200">
            前端学习中心
          </h1>
        </div>
        
        <div class="header-right">
          <ThemeToggle />
          
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
        </div>
      </div>
    </header>

    <div class="learn-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="html">
            <el-icon><Document /></el-icon>
            <span>HTML</span>
          </el-menu-item>
          <el-menu-item index="css">
            <el-icon><Brush /></el-icon>
            <span>CSS</span>
          </el-menu-item>
          <el-menu-item index="javascript">
            <el-icon><Lightning /></el-icon>
            <span>JavaScript</span>
          </el-menu-item>
          <el-menu-item index="vue3">
            <el-icon><Star /></el-icon>
            <span>Vue3</span>
          </el-menu-item>
          <el-menu-item index="react">
            <el-icon><Connection /></el-icon>
            <span>React</span>
          </el-menu-item>
          <el-menu-item index="typescript">
            <el-icon><Grid /></el-icon>
            <span>TypeScript</span>
          </el-menu-item>
          <el-menu-item index="tailwindcss">
            <el-icon><MagicStick /></el-icon>
            <span>TailwindCSS</span>
          </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">
          <div class="fav-entry" @click="router.push('/favorites')">
            <el-icon><Collection /></el-icon>
            <span>我的收藏</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ArrowDown, Document, Brush, Lightning, Star, Connection, Grid, MagicStick, House, Collection } from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AIAssistant from '@/components/AIAssistant.vue'
import { checkAdmin, getAvatarSignedUrl, getAvatarUrl } from '@/api/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = ref('html')
const canSeeAdmin = ref(false)
const avatarUrl = ref<string>('')

// 根据当前路由设置激活的菜单项
onMounted(async () => {
  const path = route.path
  if (path.includes('/learn/')) {
    activeMenu.value = path.split('/learn/')[1] || 'html'
  }

  // 登录后判断是否显示“后台管理”
  if (userStore.isLoggedIn) {
    try {
      const res = await checkAdmin()
      canSeeAdmin.value = !!res.data?.hasPermission
    } catch (e) {
      canSeeAdmin.value = false
    }
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
})

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  router.push(`/learn/${index}`)
}

const goHome = () => {
  router.push('/')
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
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/')
      break
  }
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
  background: #f5f5f5;
}

.dark .learn-page {
  background: #1a1a1a;
}

.learn-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dark .learn-header {
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
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
}

.back-home-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.back-home-btn:hover {
  background: #f0f9ff;
  color: #3b82f6;
}

.dark .back-home-btn:hover {
  background: #1e3a8a;
  color: #60a5fa;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.dark .user-info:hover {
  background: #404040;
}

.learn-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dark .sidebar {
  background: #2d2d2d;
  border-right: 1px solid #404040;
}

.sidebar-menu {
  border: none;
  flex: 1;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: white;
}

.dark .main-content {
  background: #1a1a1a;
}


:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #f0f9ff;
  color: #3b82f6;
}

.dark :deep(.el-menu-item.is-active) {
  background-color: #1e3a8a;
  color: #60a5fa;
}

.sidebar-footer {
  padding: 12px 0;
  border-top: 1px solid #eee;
}
.dark .sidebar-footer { border-top-color: #404040; }

.fav-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  cursor: pointer;
  color: #6b7280;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-top: auto;
}
.fav-entry:hover { color: #f59e0b; background: #fffbeb; }
.dark .fav-entry:hover { background: rgba(245,158,11,0.08); }
</style>

