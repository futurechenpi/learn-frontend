<template>
  <div class="admin-page" :class="{ 'dark-mode': isDark }">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <el-button :icon="isCollapsed ? Expand : Fold" text @click="toggleSidebar" class="collapse-btn" />
        <div class="logo-area">
          <span class="logo-icon">⚙️</span>
          <h1 v-show="!isCollapsed" class="system-title">管理控制台</h1>
        </div>
      </div>

      <div class="header-center">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentMenuLabel }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="header-right">
        <ThemeToggle />
        <UserDropdown :avatar-url="avatarUrl" :show-home="true" :hide-admin="true" :dark-trigger="true" />
      </div>
    </header>

    <!-- 主体区域 -->
    <div class="admin-body">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: isCollapsed }">
        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <div class="menu-group">
            <span class="group-label" v-show="!isCollapsed">数据概览</span>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'stats' }"
              @click="switchTab('stats')"
            >
              <el-icon><DataAnalysis /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">访问统计</span>
            </div>
          </div>

          <div class="menu-group">
            <span class="group-label" v-show="!isCollapsed">用户管理</span>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'users' }"
              @click="switchTab('users')"
            >
              <el-icon><UserFilled /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">用户列表</span>
            </div>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'roles' }"
              @click="switchTab('roles')"
            >
              <el-icon><Lock /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">角色权限</span>
            </div>
          </div>

          <div class="menu-group">
            <span class="group-label" v-show="!isCollapsed">内容管理</span>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'comments' }"
              @click="switchTab('comments')"
            >
              <el-icon><ChatDotRound /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">评论管理</span>
            </div>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'achievements' }"
              @click="switchTab('achievements')"
            >
              <el-icon><Trophy /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">成就系统</span>
            </div>
          </div>

          <div class="menu-group">
            <span class="group-label" v-show="!isCollapsed">系统配置</span>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'settings' }"
              @click="switchTab('settings')"
            >
              <el-icon><Setting /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">系统设置</span>
            </div>
            <div
              class="menu-item"
              :class="{ active: activeTab === 'agent' }"
              @click="switchTab('agent')"
            >
              <el-icon><MagicStick /></el-icon>
              <span class="menu-text" v-show="!isCollapsed">AI 智能体</span>
            </div>
          </div>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 访问统计 -->
        <div v-show="activeTab === 'stats'" class="tab-content">
          <div class="page-topbar">
            <h2 class="page-title">
              <el-icon><DataAnalysis /></el-icon>
              访问统计
            </h2>
            <p class="page-desc">查看网站访问数据和页面热度分析</p>
          </div>

          <div class="filters-bar">
            <el-segmented v-model="quickRange" :options="quickOptions" @change="handleQuickChange" size="default" />
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled-date="disabledDate"
              :shortcuts="shortcuts"
              unlink-panels
              @change="handleDateChange"
            />
            <el-select v-model="filterKey" placeholder="选择页面" style="width: 200px">
              <el-option v-for="opt in pageKeyOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
            <el-button type="primary" :icon="Refresh" @click="refreshAll">刷新</el-button>
          </div>

          <div class="charts-grid">
            <div ref="totalChartRef" class="chart-card total-chart"></div>
            <div ref="pageChartRef" class="chart-card page-chart"></div>
          </div>

          <div class="trend-chart-wrapper">
            <div ref="trendChartRef" class="chart-card trend-chart"></div>
          </div>
        </div>

        <!-- 角色权限 -->
        <div v-show="activeTab === 'roles'" class="tab-content">
          <div class="page-topbar">
            <h2 class="page-title">
              <el-icon><Lock /></el-icon>
              角色权限管理
            </h2>
            <p class="page-desc">管理系统用户角色与权限分配</p>
          </div>

          <div class="table-wrapper">
            <el-table :data="users" style="width: 100%" v-loading="listLoading" :size="tableSize" stripe>
              <el-table-column prop="userId" label="用户ID" width="90" align="center" />
              <el-table-column prop="userName" label="用户名" min-width="140">
                <template #default="scope">
                  <div class="user-cell">
                    <el-avatar :size="32" :src="getUserAvatarUrl(scope.row.userId) || undefined">
                      {{ scope.row.userName?.charAt(0) }}
                    </el-avatar>
                    <span>{{ scope.row.userName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
              <el-table-column label="当前角色" width="160" align="center">
                <template #default="scope">
                  <el-tag v-if="!isEditingRole(scope.row)" :type="roleTagType(scope.row.role)" effect="dark">
                    {{ roleLabel(scope.row.role) }}
                  </el-tag>
                  <el-select v-else v-model="editRoleForm.role" size="small">
                    <el-option label="普通用户" value="USER" />
                    <el-option label="管理员" value="ADMIN" />
                    <el-option label="超级管理员" value="SUPER_ADMIN" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                  <template v-if="!isEditingRole(scope.row)">
                    <el-button size="small" type="primary" plain @click="startEditRole(scope.row)">
                      <el-icon><Edit /></el-icon>修改角色
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button size="small" type="primary" @click="saveRole(scope.row)" :loading="roleLoading">保存</el-button>
                    <el-button size="small" @click="cancelEditRole">取消</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-pagination">
              <el-pagination background layout="total, prev, pager, next, sizes" :total="page.totalElements" v-model:current-page="page.page" v-model:page-size="page.size" @current-change="loadUsers" @size-change="loadUsers" />
            </div>
          </div>
        </div>

        <!-- 用户管理 -->
        <div v-show="activeTab === 'users'" class="tab-content">
          <div class="page-topbar">
            <div>
              <h2 class="page-title">
                <el-icon><UserFilled /></el-icon>
                用户管理
              </h2>
              <p class="page-desc">管理系统注册用户信息</p>
            </div>
            <el-button type="primary" :icon="Plus" @click="openAddUser">新增用户</el-button>
          </div>

          <div class="table-wrapper">
            <el-table :data="users" style="width: 100%" v-loading="listLoading" :size="tableSize" stripe>
              <el-table-column prop="userId" label="ID" width="80" align="center" />
              <el-table-column prop="userName" label="用户名" min-width="130">
                <template #default="scope">
                  <div class="user-cell">
                    <el-avatar :size="30" :src="getUserAvatarUrl(scope.row.userId) || undefined">
                      {{ scope.row.userName?.charAt(0) }}
                    </el-avatar>
                    <span>{{ scope.row.userName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="220" show-overflow-tooltip />
              <el-table-column prop="role" label="角色" width="140" align="center">
                <template #default="scope">
                  <el-tag :type="roleTagType(scope.row.role)" size="small">{{ roleLabel(scope.row.role) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                  <el-button size="small" type="primary" text @click="openEditUser(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" text @click="confirmDeleteUser(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-pagination">
              <el-pagination background layout="total, prev, pager, next, sizes" :total="page.totalElements" v-model:current-page="page.page" v-model:page-size="page.size" @current-change="loadUsers" @size-change="loadUsers" />
            </div>
          </div>
        </div>

        <!-- 评论管理 -->
        <div v-show="activeTab === 'comments'" class="tab-content">
          <div class="page-topbar">
            <div>
              <h2 class="page-title">
                <el-icon><ChatDotRound /></el-icon>
                评论管理
              </h2>
              <p class="page-desc">审核和管理用户评论内容</p>
            </div>
            <div class="comment-filters">
              <el-select v-model="commentCourseFilter" placeholder="全部课程" clearable style="width: 180px" @change="loadComments">
                <el-option v-for="c in courseKeyOptions" :key="c.value" :label="c.label" :value="c.value" />
              </el-select>
              <el-button :icon="Refresh" @click="loadComments">刷新</el-button>
            </div>
          </div>

          <div class="table-wrapper">
            <el-table :data="adminComments" style="width: 100%" v-loading="commentLoading" :size="tableSize" stripe>
              <el-table-column prop="id" label="ID" width="70" align="center" />
              <el-table-column label="课程" width="130">
                <template #default="scope"><el-tag size="small">{{ getCourseLabel(scope.row.courseKey) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="userName" label="用户" width="110" />
              <el-table-column prop="content" label="评论内容" min-width="280" show-overflow-tooltip />
              <el-table-column label="时间" width="165">
                <template #default="scope">{{ formatCommentTime(scope.row.createdAt) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="90" align="center">
                <template #default="scope">
                  <el-button size="small" type="danger" text @click="confirmDeleteComment(scope.row)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer-info">
              共 {{ adminComments.length }} 条评论
            </div>
          </div>
        </div>

        <!-- 成就管理 -->
        <div v-show="activeTab === 'achievements'" class="tab-content">
          <div class="page-topbar">
            <div>
              <h2 class="page-title">
                <el-icon><Trophy /></el-icon>
                成就系统
              </h2>
              <p class="page-desc">管理学习成就与解锁条件</p>
            </div>
          </div>

          <div class="table-wrapper">
            <el-table :data="adminAchievements" style="width: 100%" v-loading="achievementLoading" :size="tableSize" stripe>
              <el-table-column prop="id" label="ID" width="70" align="center" />
              <el-table-column label="图标" width="70" align="center">
                <template #default="scope"><span class="achievement-icon">{{ scope.row.icon }}</span></template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="140" />
              <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
              <el-table-column prop="code" label="条件代码" width="140" />
              <el-table-column prop="conditionValue" label="条件值" width="90" align="center" />
            </el-table>
          </div>
        </div>

        <!-- AI 智能体 -->
        <div v-show="activeTab === 'agent'" class="tab-content">
          <AdminAgent />
        </div>

        <!-- 系统设置 -->
        <div v-show="activeTab === 'settings'" class="tab-content">
          <div class="page-topbar">
            <div>
              <h2 class="page-title">
                <el-icon><Setting /></el-icon>
                系统设置
              </h2>
              <p class="page-desc">自定义平台外观和行为偏好</p>
            </div>
          </div>

          <div class="settings-cards">
            <el-card shadow="hover" class="setting-card">
              <template #header>
                <div class="card-title-row">
                  <el-icon><Brush /></el-icon>
                  <span>外观主题</span>
                </div>
              </template>
              <div class="setting-items">
                <div class="setting-item">
                  <label>主题模式</label>
                  <el-segmented v-model="settings.themeMode" :options="themeModeOptions" />
                </div>
                <div class="setting-item">
                  <label>主色调</label>
                  <el-color-picker v-model="settings.primaryColor" show-alpha={false} />
                </div>
                <div class="setting-item full">
                  <label>站点标题</label>
                  <el-input v-model="settings.siteTitle" placeholder="站点标题" />
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="setting-card">
              <template #header>
                <div class="card-title-row">
                  <el-icon><Grid /></el-icon>
                  <span>列表与分页</span>
                </div>
              </template>
              <div class="setting-items">
                <div class="setting-item">
                  <label>默认每页条数</label>
                  <el-select v-model="settings.pageSizeDefault" style="width: 140px">
                    <el-option :value="10" label="10" />
                    <el-option :value="20" label="20" />
                    <el-option :value="50" label="50" />
                  </el-select>
                </div>
                <div class="setting-item">
                  <label>表格密度</label>
                  <el-radio-group v-model="settings.tableDensity">
                    <el-radio-button label="compact">紧凑</el-radio-button>
                    <el-radio-button label="normal">标准</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="setting-card">
              <template #header>
                <div class="card-title-row">
                  <el-icon><Monitor /></el-icon>
                  <span>仪表盘</span>
                </div>
              </template>
              <div class="setting-items">
                <div class="setting-item">
                  <label>自动刷新间隔</label>
                  <el-select v-model="settings.dashboardRefreshSec" style="width: 140px">
                    <el-option :value="0" label="关闭" />
                    <el-option :value="30" label="30秒" />
                    <el-option :value="60" label="60秒" />
                  </el-select>
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="setting-card">
              <template #header>
                <div class="card-title-row">
                  <el-icon><Document /></el-icon>
                  <span>代码编辑器</span>
                </div>
              </template>
              <div class="setting-items">
                <div class="setting-item">
                  <label>字体大小</label>
                  <el-input-number v-model="settings.editor.fontSize" :min="10" :max="24" />
                </div>
                <div class="setting-item">
                  <label>自动换行</label>
                  <el-switch v-model="settings.editor.wordWrap" />
                </div>
                <div class="setting-item">
                  <label>Minimap</label>
                  <el-switch v-model="settings.editor.minimap" />
                </div>
                <div class="setting-item">
                  <label>保存时格式化</label>
                  <el-switch v-model="settings.editor.formatOnSave" />
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="setting-card">
              <template #header>
                <div class="card-title-row">
                  <el-icon><MagicStick /></el-icon>
                  <span>AI 助手</span>
                </div>
              </template>
              <div class="setting-items">
                <div class="setting-item">
                  <label>显示建议</label>
                  <el-switch v-model="settings.ai.showSuggestions" />
                </div>
                <div class="setting-item">
                  <label>超时时间(秒)</label>
                  <el-input-number v-model="settings.ai.timeoutSec" :min="5" :max="60" />
                </div>
              </div>
            </el-card>

            <div class="settings-actions">
              <el-button type="primary" size="large" :icon="Check" @click="saveSettings">保存设置</el-button>
              <el-button size="large" :icon="RefreshLeft" @click="resetSettings">恢复默认</el-button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 用户新增/编辑弹窗 -->
    <el-dialog v-model="userDialogVisible" :title="userFormMode === 'add' ? '新增用户' : '编辑用户'" width="500px" destroy-on-close>
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password" placeholder="请输入密码" type="password" show-password prefix-icon="Lock" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" placeholder="请输入邮箱（可选）" prefix-icon="Message" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis, UserFilled, Lock, ChatDotRound, Trophy,
  Setting, MagicStick, Refresh, Plus, Edit, Delete,
  Check, RefreshLeft, Brush, Grid, Monitor, Document,
  User, Expand, Fold
} from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AdminAgent from '@/components/AdminAgent.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import { getRangeTotalCount, getRangeCountByKey, pageUsers, updateUserRole, addUser, editUser, deleteUser, type UserInfo, getAvatarUrl, getAvatarProxyUrl } from '@/api/user'
import { adminGetAllComments, adminDeleteComment } from '@/api/comment'
import { getAllAchievements } from '@/api/achievement'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const isDark = computed(() => (themeStore as any).isDark)

const isCollapsed = ref(false)
const toggleSidebar = () => { isCollapsed.value = !isCollapsed.value }

const avatarUrl = ref<string | null>(null)
const userAvatarMap = ref<Map<number, string>>(new Map())

const fetchAdminAvatar = async () => {
  if (!userStore.userInfo?.userId) return
  try {
    const userId = userStore.userInfo.userId
    const res: any = await getAvatarUrl(userId)
    if (res?.data) {
      avatarUrl.value = getAvatarProxyUrl(userId)
    }
  } catch (e) {
    console.warn('获取管理员头像失败', e)
  }
}

const fetchUserAvatars = async (userList: UserInfo[]) => {
  const newMap = new Map<number, string>()
  
  await Promise.allSettled(
    userList.map(async (user) => {
      if (!user.userId) return
      try {
        const res: any = await getAvatarUrl(user.userId)
        if (res?.data) {
          newMap.set(user.userId, getAvatarProxyUrl(user.userId))
        }
      } catch (e) {
        // 静默失败，显示默认首字母头像
      }
    })
  )
  
  userAvatarMap.value = newMap
}

const getUserAvatarUrl = (userId: number) => {
  return userAvatarMap.value.get(userId)
}

onMounted(() => {
  setQuickRange('today')
  refreshAll()
  applySettingsToPages()
  fetchAdminAvatar()
})

const totalChartRef = ref<HTMLElement>()
const pageChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
let totalChart: echarts.ECharts | null = null
let pageChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

const activeTab = ref<'stats' | 'roles' | 'users' | 'settings' | 'agent' | 'comments' | 'achievements'>('stats')

const currentMenuLabel = computed(() => {
  const map: Record<string, string> = {
    stats: '访问统计', roles: '角色权限', users: '用户管理',
    settings: '系统设置', agent: 'AI 智能体', comments: '评论管理', achievements: '成就系统'
  }
  return map[activeTab.value] || ''
})

const switchTab = (tab: any) => { activeTab.value = tab }

// ========== 统计相关 ==========
const filterKey = ref('home')
const pageKeyOptions = [
  { label: '首页', value: 'home' }, { label: '学习中心', value: 'learn' },
  { label: '登录', value: 'login' }, { label: '注册', value: 'register' },
  { label: 'HTML 学习', value: 'learn-html' }, { label: 'CSS 学习', value: 'learn-css' },
  { label: 'JavaScript 学习', value: 'learn-javascript' }, { label: 'Vue3 学习', value: 'learn-vue3' },
  { label: 'React 学习', value: 'learn-react' }, { label: 'TypeScript 学习', value: 'learn-typescript' },
  { label: 'TailwindCSS 学习', value: 'learn-tailwindcss' }, { label: '个人资料', value: 'profile' },
  { label: '后台管理', value: 'admin' }
]
const dateRange = ref<[Date, Date] | null>(null)
const quickRange = ref<'yesterday' | 'today' | 'thisWeek' | 'thisMonth'>('today')
const quickOptions = [
  { label: '昨天', value: 'yesterday' }, { label: '今天', value: 'today' },
  { label: '本周', value: 'thisWeek' }, { label: '本月', value: 'thisMonth' }
]

const today = new Date()
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const startOfWeek = (d: Date) => { const day = d.getDay() || 7; return addDays(startOfDay(d), -(day - 1)) }
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)

const disabledDate = (time: Date) => {
  if (time.getTime() > endOfDay(today).getTime()) return true
  if (dateRange.value) {
    const [start] = dateRange.value
    if (start && !dateRange.value[1]) if (time.getTime() > addDays(start, 30).getTime()) return true
  }
  return false
}

const shortcuts = [
  { text: '昨天', value: () => [startOfDay(addDays(today, -1)), endOfDay(addDays(today, -1))] },
  { text: '今天', value: () => [startOfDay(today), endOfDay(today)] },
  { text: '本周', value: () => [startOfWeek(today), endOfDay(today)] },
  { text: '本月', value: () => [startOfMonth(today), endOfDay(today)] }
]

const setQuickRange = (tag: typeof quickRange.value) => {
  quickRange.value = tag
  switch (tag) {
    case 'yesterday': dateRange.value = [startOfDay(addDays(today, -1)), endOfDay(addDays(today, -1))]; break
    case 'today': dateRange.value = [startOfDay(today), endOfDay(today)]; break
    case 'thisWeek': dateRange.value = [startOfWeek(today), endOfDay(today)]; break
    case 'thisMonth': dateRange.value = [startOfMonth(today), endOfDay(today)]; break
  }
}

const handleQuickChange = (val: any) => { setQuickRange(val); refreshAll() }
const handleDateChange = () => { refreshAll() }

const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

const refreshAll = async () => {
  if (!dateRange.value) return
  const [start, end] = dateRange.value
  const startDate = formatDate(start), endDate = formatDate(end)
  const label = `${startDate} ~ ${endDate}`
  const totalRes = await getRangeTotalCount(startDate, endDate)
  const totalValue = typeof totalRes.data === 'number' ? totalRes.data : 0
  renderTotalChart(label, totalValue)
  const pageRes = await getRangeCountByKey(startDate, endDate, filterKey.value || 'home')
  const pageValue = typeof pageRes.data === 'number' ? pageRes.data : 0
  renderPageChart(label, pageValue)
  await renderTrendChart(start, end)
}

const renderTotalChart = (label: string, value: number) => {
  if (!totalChart && totalChartRef.value) totalChart = echarts.init(totalChartRef.value)
  totalChart?.setOption({
    title: { text: '总访问次数', left: 'center', textStyle: { fontSize: 16, fontWeight: 600, color: '#374151' } },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#e5e7eb', textStyle: { color: '#374151' } },
    grid: { top: 60, bottom: 30, left: 40, right: 20 },
    xAxis: { type: 'category', data: [label], axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6' } }, axisLabel: { color: '#6b7280' } },
    series: [{ type: 'bar', data: [value], barWidth: '50%', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }]), borderRadius: [8, 8, 0, 0] }, label: { show: true, position: 'top', fontSize: 18, fontWeight: 'bold', color: '#667eea' } }]
  })
}

const renderPageChart = (label: string, value: number) => {
  if (!pageChart && pageChartRef.value) pageChart = echarts.init(pageChartRef.value)
  const pageLabel = pageKeyOptions.find(o => o.value === filterKey.value)?.label || filterKey.value
  pageChart?.setOption({
    title: { text: `「${pageLabel}」访问量`, left: 'center', textStyle: { fontSize: 16, fontWeight: 600, color: '#374151' } },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#e5e7eb', textStyle: { color: '#374151' } },
    grid: { top: 60, bottom: 30, left: 40, right: 20 },
    xAxis: { type: 'category', data: [label], axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6' } }, axisLabel: { color: '#6b7280' } },
    series: [{ type: 'bar', data: [value], barWidth: '50%', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#059669' }]), borderRadius: [8, 8, 0, 0] }, label: { show: true, position: 'top', fontSize: 18, fontWeight: 'bold', color: '#10b981' } }]
  })
}

const renderTrendChart = async (start: Date, end: Date) => {
  if (!trendChart && trendChartRef.value) trendChart = echarts.init(trendChartRef.value)

  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const dates: string[] = []
  const totalData: number[] = []
  const pageData: number[] = []

  for (let i = 0; i < daysDiff; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const dateStr = formatDate(d)
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`)

    try {
      const totalRes: any = await getRangeTotalCount(dateStr, dateStr)
      totalData.push(typeof totalRes.data === 'number' ? totalRes.data : 0)
    } catch {
      totalData.push(0)
    }

    try {
      const pageRes: any = await getRangeCountByKey(dateStr, dateStr, filterKey.value || 'home')
      pageData.push(typeof pageRes.data === 'number' ? pageRes.data : 0)
    } catch {
      pageData.push(0)
    }
  }

  const pageLabel = pageKeyOptions.find(o => o.value === filterKey.value)?.label || filterKey.value

  trendChart?.setOption({
    title: { text: '访问趋势分析', left: 'center', textStyle: { fontSize: 18, fontWeight: 700, color: '#1e293b' } },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px;',
      axisPointer: { type: 'cross', crossStyle: { color: '#94a3b8' } }
    },
    legend: {
      data: ['总访问量', `${pageLabel}访问量`],
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: '#64748b', fontSize: 12 }
    },
    grid: { top: 70, right: 30, bottom: 50, left: 55, containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    series: [
      {
        name: '总访问量',
        type: 'line',
        data: totalData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#6366f1' },
        itemStyle: { color: '#6366f1', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99,102,241,0.25)' },
            { offset: 1, color: 'rgba(99,102,241,0.02)' }
          ])
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 10, shadowColor: 'rgba(99,102,241,0.4)' } }
      },
      {
        name: `${pageLabel}访问量`,
        type: 'line',
        data: pageData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 7,
        lineStyle: { width: 2.5, color: '#10b981', type: 'dashed' },
        itemStyle: { color: '#10b981', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16,185,129,0.18)' },
            { offset: 1, color: 'rgba(16,185,129,0.01)' }
          ])
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 10, shadowColor: 'rgba(16,185,129,0.4)' } }
      }
    ],
    animationDuration: 1200,
    animationEasing: 'cubicOut'
  })
}

// ========== 用户/角色管理 ==========
const users = ref<UserInfo[]>([])
const listLoading = ref(false)
const page = ref({ page: 1, size: 10, totalElements: 0 })
const tableSize = ref<'small' | ''>('')

const loadUsers = async () => {
  listLoading.value = true
  try {
    const res = await pageUsers({ page: page.value.page - 1, size: page.value.size })
    const payload: any = res.data
    users.value = payload?.content || []
    page.value.totalElements = payload?.totalElements || 0
    if (users.value.length > 0) {
      await fetchUserAvatars(users.value)
    }
  } finally { listLoading.value = false }
}

const editingRoleUserId = ref<number | null>(null)
const roleLoading = ref(false)
const editRoleForm = ref<{ role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null }>({ role: null })

const isEditingRole = (row: UserInfo) => editingRoleUserId.value === row.userId
const startEditRole = (row: UserInfo) => { editingRoleUserId.value = row.userId; editRoleForm.value.role = (row.role ?? null) as any }
const cancelEditRole = () => { editingRoleUserId.value = null }

const roleRank: Record<string, number> = { USER: 1, ADMIN: 2, SUPER_ADMIN: 3 }
const getRank = (r: any) => (r && roleRank[r]) ? roleRank[r] : 0
const roleLabel = (role: any) => role === 'ADMIN' ? '管理员' : role === 'SUPER_ADMIN' ? '超级管理员' : '普通用户'
const roleTagType = (role: any) => role === 'SUPER_ADMIN' ? 'danger' : role === 'ADMIN' ? 'warning' : ''

const saveRole = async (row: UserInfo) => {
  const newRole = editRoleForm.value.role
  if (newRole === row.role) { editingRoleUserId.value = null; return }
  const currentRole = userStore.userInfo?.role ?? null
  const currentRank = getRank(currentRole), targetRank = getRank(row.role), newRank = getRank(newRole)
  if (currentRank === targetRank) { ElMessage.error('无权限：无法修改与自己同级的账号'); return }
  if (targetRank > currentRank) { ElMessage.error('无权限：无法修改比自己级别高的账号'); return }
  if (newRank > currentRank) { ElMessage.error('不可将他人设置为比自己更高的角色'); return }
  if (row.role === 'SUPER_ADMIN' && currentRole !== 'SUPER_ADMIN') { ElMessage.error('不可修改超级管理员'); return }
  roleLoading.value = true
  try {
    const res = await updateUserRole({ userId: row.userId, role: newRole as any })
    row.role = (res as any)?.data?.role ?? newRole ?? null
    editingRoleUserId.value = null
    ElMessage.success('角色已更新')
  } finally { roleLoading.value = false }
}

const userDialogVisible = ref(false)
const userFormMode = ref<'add' | 'edit'>('add')
const userForm = ref<{ userId?: string; userName: string; password: string; email?: string }>({ userName: '', password: '', email: '' })

const openAddUser = () => { userFormMode.value = 'add'; userForm.value = { userName: '', password: '', email: '' }; userDialogVisible.value = true }
const openEditUser = (row: UserInfo) => { userFormMode.value = 'edit'; userForm.value = { userId: String(row.userId), userName: row.userName, password: row.password || '', email: row.email || '' }; userDialogVisible.value = true }
const confirmDeleteUser = async (row: UserInfo) => {
  try { await ElMessageBox.confirm(`确认删除用户【${row.userName}】吗？`, '提示', { type: 'warning' }); await deleteUser(String(row.userId)); ElMessage.success('已删除'); loadUsers() } catch {}
}
const submitUser = async () => {
  if (userFormMode.value === 'add') await addUser({ userName: userForm.value.userName, password: userForm.value.password, email: userForm.value.email })
  else await editUser({ userId: userForm.value.userId!, userName: userForm.value.userName, password: userForm.value.password, email: userForm.value.email })
  ElMessage.success(userFormMode.value === 'add' ? '新增成功' : '修改成功')
  userDialogVisible.value = false; loadUsers()
}

// ========== 评论管理 ==========
const adminComments = ref<any[]>([])
const commentLoading = ref(false)
const commentCourseFilter = ref('')
const courseKeyOptions = [
  { label: 'HTML 基础', value: 'html' }, { label: 'CSS 样式', value: 'css' },
  { label: 'JavaScript', value: 'javascript' }, { label: 'Vue3 框架', value: 'vue3' },
  { label: 'React 框架', value: 'react' }, { label: 'TypeScript', value: 'typescript' },
  { label: 'TailwindCSS', value: 'tailwindcss' }
]
const courseLabelMap: Record<string, string> = { html: 'HTML 基础', css: 'CSS 样式', javascript: 'JavaScript', vue3: 'Vue3 框架', react: 'React 框架', typescript: 'TypeScript', tailwindcss: 'TailwindCSS' }
function getCourseLabel(key: string) { return courseLabelMap[key] || key }
function formatCommentTime(time: string | null) { if (!time) return '-'; const d = new Date(time); const pad = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}` }

async function loadComments() {
  commentLoading.value = true
  try { const res: any = await adminGetAllComments(commentCourseFilter.value || undefined); adminComments.value = res?.data || [] } finally { commentLoading.value = false }
}
async function confirmDeleteComment(row: any) { try { await ElMessageBox.confirm(`确认删除【${row.userName}】在${getCourseLabel(row.courseKey)}的这条评论吗？`, '删除评论', { type: 'warning' }); await adminDeleteComment(row.id); ElMessage.success('已删除'); loadComments() } catch {} }

// ========== 成就管理 ==========
const adminAchievements = ref<any[]>([])
const achievementLoading = ref(false)
async function loadAchievements() {
  achievementLoading.value = true
  try { const res: any = await getAllAchievements(); adminAchievements.value = res?.data || [] } finally { achievementLoading.value = false }
}

// ========== 系统设置 ==========
type Settings = { themeMode: 'auto' | 'light' | 'dark'; primaryColor: string; siteTitle: string; pageSizeDefault: number; tableDensity: 'compact' | 'normal'; dashboardRefreshSec: number; editor: { fontSize: number; wordWrap: boolean; minimap: boolean; formatOnSave: boolean }; ai: { showSuggestions: boolean; timeoutSec: number } }
const SETTINGS_KEY = 'appSettings'
const defaultSettings: Settings = {
  themeMode: (localStorage.getItem('theme') as any) ? ((localStorage.getItem('theme') as any) as 'light'|'dark') : 'auto',
  primaryColor: localStorage.getItem('primaryColor') || '#3b82f6', siteTitle: '前端学习网站',
  pageSizeDefault: 10, tableDensity: 'normal', dashboardRefreshSec: 60,
  editor: { fontSize: 14, wordWrap: true, minimap: false, formatOnSave: true },
  ai: { showSuggestions: true, timeoutSec: 15 }
}
const settings = reactive<Settings>({ ...defaultSettings, ...safeReadSettings() })
const themeModeOptions = [{ label: '自动', value: 'auto' }, { label: '明亮', value: 'light' }, { label: '暗黑', value: 'dark' }]

function safeReadSettings(): Partial<Settings> { try { const raw = localStorage.getItem(SETTINGS_KEY); return raw ? JSON.parse(raw) : {} } catch { return {} } }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); ElMessage.success('设置已保存'); applySettings() }
function resetSettings() { Object.assign(settings, defaultSettings); saveSettings() }

function applySettings() {
  if (settings.themeMode === 'auto') { const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; (themeStore as any).isDark = prefersDark }
  else { ;(themeStore as any).isDark = (settings.themeMode === 'dark') }
  localStorage.setItem('theme', (themeStore as any).isDark ? 'dark' : 'light'); themeStore.initTheme()
  themeStore.setPrimaryColor(settings.primaryColor)
  if (document && document.title) { const parts = document.title.split(' - '); document.title = `${parts[0]} - ${settings.siteTitle}` }
  localStorage.setItem('pageSizeDefault', String(settings.pageSizeDefault))
  localStorage.setItem('tableDensity', settings.tableDensity)
  localStorage.setItem('dashboardRefreshSec', String(settings.dashboardRefreshSec))
  localStorage.setItem('editorSettings', JSON.stringify(settings.editor))
  localStorage.setItem('aiSettings', JSON.stringify(settings.ai))
}
watch(() => settings.themeMode, applySettings)
watch(() => settings.primaryColor, applySettings)

let autoTimer: any = null
function applySettingsToPages(){
  try {
    const sRaw = localStorage.getItem('appSettings'); const s = sRaw ? JSON.parse(sRaw) : {}
    tableSize.value = s.tableDensity === 'compact' ? 'small' : ''
    if (s.pageSizeDefault && typeof s.pageSizeDefault === 'number') page.value.size = s.pageSizeDefault
    if (autoTimer) clearInterval(autoTimer)
    if (activeTab.value === 'stats') { const sec = Number(s.dashboardRefreshSec || 0); if (sec > 0) autoTimer = setInterval(() => { refreshAll() }, sec * 1000) }
  } catch {}
}
watch(() => activeTab.value, () => applySettingsToPages())

onMounted(() => {
  setQuickRange('today'); refreshAll(); applySettingsToPages()
  if (activeTab.value === 'roles' || activeTab.value === 'users') loadUsers()
  window.addEventListener('resize', () => { totalChart?.resize(); pageChart?.resize(); trendChart?.resize() })
})

watch(() => filterKey.value, () => { refreshAll() })
watch(() => activeTab.value, (val) => {
  if (val === 'roles' || val === 'users') loadUsers()
  if (val === 'stats') {
    nextTick(() => {
      if (!totalChart && totalChartRef.value) totalChart = echarts.init(totalChartRef.value)
      if (!pageChart && pageChartRef.value) pageChart = echarts.init(pageChartRef.value)
      totalChart?.resize(); pageChart?.resize(); setTimeout(() => { totalChart?.resize(); pageChart?.resize() }, 0)
      refreshAll()
    })
  }
  if (val === 'comments') loadComments()
  if (val === 'achievements') loadAchievements()
})
</script>

<style scoped>
.admin-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f1f5f9;
}

.dark-mode { background: #0f172a; }

/* ===== 头部 ===== */
.admin-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left { display: flex; align-items: center; gap: 12px; }

.collapse-btn { color: #94a3b8 !important; font-size: 18px; }
.collapse-btn:hover { color: #fff !important; background: rgba(255,255,255,0.08); }

.logo-area { display: flex; align-items: center; gap: 10px; }
.logo-icon { font-size: 24px; }
.system-title { margin: 0; font-size: 20px; font-weight: 700; color: #f1f5f9; letter-spacing: 0.5px; }

.header-center { flex: 1; display: flex; justify-content: center; }
:deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) { color: #94a3b8 !important; }
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) { color: #e2e8f0 !important; font-weight: 500; }

.header-right { display: flex; align-items: center; gap: 16px; }

/* ===== 主体布局 ===== */
.admin-body { flex: 1; display: flex; overflow: hidden; }

/* ===== 侧边栏 ===== */
.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}
.sidebar.collapsed { width: 72px; }
.dark .sidebar { background: #1e293b; border-right-color: #334155; }

.nav-menu { padding: 12px 0; display: flex; flex-direction: column; gap: 8px; }

.menu-group { margin-bottom: 8px; }
.group-label {
  display: block; padding: 8px 20px 6px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;
}
.dark .group-label { color: #64748b; }

.menu-item {
  display: flex; align-items: center; gap: 12px; padding: 11px 20px;
  margin: 2px 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s;
  color: #64748b; font-size: 14px; font-weight: 500;
}
.menu-item:hover { background: #f1f5f9; color: #334155; }
.menu-item.active {
  background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
  color: #6366f1; font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(99,102,241,0.2);
}
.dark .menu-item { color: #94a3b8; }
.dark .menu-item:hover { background: #334155; color: #e2e8f0; }
.dark .menu-item.active { background: rgba(99,102,241,0.15); color: #a5b4fc; box-shadow: inset 0 0 0 1px rgba(99,102,241,0.25); }

.menu-text { white-space: nowrap; }
.menu-item .el-icon { font-size: 18px; flex-shrink: 0; }

/* ===== 主内容区 ===== */
.main-content {
  flex: 1; overflow-y: auto; padding: 28px 32px;
  background: #f1f5f9;
}
.dark .main-content { background: #0f172a; }

.tab-content { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.page-topbar { margin-bottom: 24px; }
.page-topbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.page-title { display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #1e293b; }
.dark .page-title { color: #f1f5f9; }
.page-title .el-icon { font-size: 24px; color: #6366f1; }
.page-desc { margin: 0; color: #64748b; font-size: 14px; }
.dark .page-desc { color: #94a3b8; }

/* ===== 过滤器栏 ===== */
.filters-bar, .comment-filters {
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  background: #fff; padding: 16px 20px; border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 20px;
}
.dark .filters-bar, .dark .comment-filters { background: #1e293b; border: 1px solid #334155; }

/* ===== 图表 ===== */
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
.chart-card {
  background: #fff; border-radius: 14px; padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
  min-height: 380px; transition: all 0.3s;
}
.chart-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
.dark .chart-card { background: #1e293b; border-color: #334155; }

.trend-chart-wrapper { margin-top: 20px; }
.trend-chart {
  min-height: 420px;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
}
.dark .trend-chart { background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }

/* ===== 表格 ===== */
.table-wrapper {
  background: #fff; border-radius: 14px; padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;
}
.dark .table-wrapper { background: #1e293b; border-color: #334155; }

.table-pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
.table-footer-info { margin-top: 16px; text-align: right; color: #94a3b8; font-size: 13px; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-cell span { font-weight: 500; color: #334155; }
.dark .user-cell span { color: #e2e8f0; }

/* ===== 设置面板 ===== */
.settings-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px; margin-bottom: 24px; }
.setting-card { border-radius: 14px; transition: all 0.3s; }
.setting-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.card-title-row { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; color: #334155; }
.dark .card-title-row { color: #e2e8f0; }
.card-title-row .el-icon { color: #6366f1; font-size: 18px; }

.setting-items { display: flex; flex-direction: column; gap: 18px; }
.setting-item { display: flex; align-items: center; gap: 12px; }
.setting-item > label { min-width: 90px; font-size: 13px; color: #64748b; font-weight: 500; }
.dark .setting-item > label { color: #94a3b8; }
.setting-item.full { flex-direction: column; align-items: stretch; }
.setting-item.full > label { margin-bottom: 6px; }

.settings-actions { display: flex; gap: 12px; justify-content: center; margin-top: 8px; }

/* ===== 暗色模式适配 ===== */
:deep(.el-table) { --el-table-border-color: #e2e8f0; --el-table-header-bg-color: #f8fafc; --el-table-row-hover-bg-color: #f1f5f9; }
.dark :deep(.el-table) { --el-table-border-color: #334155; --el-table-header-bg-color: #1e293b; --el-table-row-hover-bg-color: #334155; --el-table-text-color: #e2e8f0; }

:deep(.el-pagination.is-background .btn-default) { background: #fff; color: #64748b; }
:deep(.el-pagination.is-background .btn-default:hover) { color: #6366f1; }

:deep(.el-dialog) { border-radius: 16px; overflow: hidden; }
:deep(.el-dialog__header) { background: #f8fafc; padding: 16px 24px; margin: 0; border-bottom: 1px solid #e2e8f0; }
:deep(.el-dialog__title) { font-weight: 600; color: #1e293b; }
.dark :deep(.el-dialog__header) { background: #1e293b; border-bottom-color: #334155; }
.dark :deep(.el-dialog__title) { color: #f1f5f9; }

/* 滚动条美化 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
