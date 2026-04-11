<template>
  <div class="user-dropdown" ref="dropdownRef">
    <div class="dropdown-trigger" :class="{ 'dark-trigger': darkTrigger }" @click.stop="toggleDropdown">
      <el-avatar :size="32" class="trigger-avatar" :src="avatarUrl || undefined">
        {{ userStore.userInfo?.userName?.charAt(0) }}
      </el-avatar>
      <span class="trigger-name">{{ userStore.userInfo?.userName }}</span>
      <el-icon class="trigger-arrow" :class="{ 'is-open': isOpen }"><ArrowDown /></el-icon>
    </div>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <!-- 用户信息头部 -->
        <div class="panel-header">
          <div class="header-avatar">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" />
            <div v-else class="avatar-fallback">{{ (userStore.userInfo?.userName || '?')[0] }}</div>
          </div>
          <div class="header-info">
            <p class="header-name">{{ userStore.userInfo?.userName }}</p>
            <p class="header-email">{{ userStore.userInfo?.email || '暂无邮箱' }}</p>
          </div>
        </div>

        <div class="panel-divider"></div>

        <!-- 菜单项 -->
        <div class="panel-menu">
          <div class="menu-item" @click="handleAction('profile')">
            <span class="menu-icon">👤</span>
            <span class="menu-text">个人资料</span>
            <span class="menu-arrow">›</span>
          </div>
          <div v-if="canSeeAdmin && !hideAdmin" class="menu-item" @click="handleAction('admin')">
            <span class="menu-icon">⚙️</span>
            <span class="menu-text">后台管理</span>
            <span class="menu-arrow">›</span>
          </div>
          <div v-if="showHome" class="menu-item" @click="handleAction('home')">
            <span class="menu-icon">🏠</span>
            <span class="menu-text">返回前台</span>
            <span class="menu-arrow">›</span>
          </div>
        </div>

        <div class="panel-divider"></div>

        <!-- 退出登录 -->
        <div class="panel-footer">
          <div class="menu-item menu-item--danger" @click="handleAction('logout')">
            <span class="menu-icon">🚪</span>
            <span class="menu-text">退出登录</span>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="isOpen" class="dropdown-backdrop" @click="closeDropdown"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { checkAdmin } from '@/api/user'

const props = defineProps<{
  avatarUrl?: string
  showHome?: boolean
  hideAdmin?: boolean
  darkTrigger?: boolean
}>()

const router = useRouter()
const userStore = useUserStore()
const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)
const canSeeAdmin = ref(false)

onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      const res = await checkAdmin()
      canSeeAdmin.value = !!res?.data?.hasPermission
    } catch {}
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function handleClickOutside(e: Event) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

function handleAction(command: string) {
  closeDropdown()
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'home':
      router.push('/')
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/')
      break
  }
}
</script>

<style scoped>
.user-dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 10px;
  transition: all 0.25s ease;
  background: transparent;
  border: 1px solid transparent;
}

.dropdown-trigger:hover {
  background: #f5f7fa;
  border-color: #e8ecf1;
}

.dark .dropdown-trigger:hover {
  background: #222;
  border-color: #333;
}

.trigger-avatar {
  border: 2px solid transparent !important;
  transition: border-color 0.2s;
}

.dropdown-trigger:hover .trigger-avatar {
  border-color: #6366f1 !important;
}

.trigger-name {
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .trigger-name { color: #d1d5db; }

/* 深色 header 适配（如后台管理页面） */
.dark-trigger {
  color: #e2e8f0 !important;
}

.dark-trigger .trigger-name {
  color: #f1f5f9 !important;
}

.dark-trigger .trigger-arrow {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-trigger:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.trigger-arrow {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.25s ease;
}

.trigger-arrow.is-open {
  transform: rotate(180deg);
}

/* 下拉面板 */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
  z-index: 2000;
  overflow: hidden;
}

.dark .dropdown-panel {
  background: #1a1a2e;
  border-color: #2d2d44;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px 16px;
}

.header-avatar {
  flex-shrink: 0;
}

.header-avatar img,
.avatar-fallback {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  object-fit: cover;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.header-info {
  min-width: 0;
  flex: 1;
}

.header-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .header-name { color: #f1f5f9; }

.header-email {
  margin: 3px 0 0;
  font-size: 11.5px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 0 16px;
}

.dark .panel-divider {
  background: linear-gradient(90deg, transparent, #333, transparent);
}

.panel-menu {
  padding: 6px 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13.5px;
  color: #4b5563;
  font-weight: 500;
}

.menu-item:hover {
  background: #f0f2ff;
  color: #4338ca;
}

.dark .menu-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
}

.menu-icon {
  font-size: 16px;
  line-height: 1;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
}

.menu-arrow {
  color: #c4c8d4;
  font-size: 16px;
  transition: transform 0.2s;
}

.menu-item:hover .menu-arrow {
  transform: translateX(2px);
  color: #6366f1;
}

.dark .menu-item:hover .menu-arrow {
  color: #8b5cf6;
}

.panel-footer {
  padding: 4px 10px 10px;
}

.menu-item--danger {
  color: #ef4444;
}

.menu-item--danger:hover {
  background: #fef2f2;
  color: #dc2626;
}

.dark .menu-item--danger {
  color: #f87171;
}

.dark .menu-item--danger:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #fca5a5;
}

/* 遮罩层 */
.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
}

/* 过渡动画 */
.dropdown-enter-active {
  animation: dropdownIn 0.22s ease;
}
.dropdown-leave-active {
  animation: dropdownOut 0.15s ease;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
  }
}
</style>
