<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1 class="title">后台管理</h1>
      <div class="header-actions">
        <el-button @click="goHome" class="home-btn">
          返回首页
        </el-button>
      </div>
    </header>

    <main class="admin-main">
      <aside class="sidebar">
        <el-menu :default-active="activeTab" class="menu" @select="handleSideSelect">
          <el-menu-item index="stats">访问统计</el-menu-item>
          <el-menu-item index="roles">角色权限</el-menu-item>
          <el-menu-item index="users">用户管理</el-menu-item>
          <el-menu-item index="settings">系统设置</el-menu-item>
          <el-menu-item index="agent">智能体（陈刚）</el-menu-item>
          <el-menu-item index="comments">评论管理</el-menu-item>
          <el-menu-item index="achievements">成就管理</el-menu-item>
        </el-menu>
      </aside>

      <section class="content">
        <div v-show="activeTab === 'stats'">
            <div class="filters">
              <el-segmented v-model="quickRange" :options="quickOptions" @change="handleQuickChange" />
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
              <el-select v-model="filterKey" placeholder="选择页面" style="width: 220px">
                <el-option
                  v-for="opt in pageKeyOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-button type="primary" @click="refreshAll">刷新</el-button>
            </div>
            <div class="charts">
              <div ref="totalChartRef" class="chart-box"></div>
              <div ref="pageChartRef" class="chart-box"></div>
            </div>
        </div>

        <div v-show="activeTab === 'roles'">
            <div class="role-panel">
              <el-table :data="users" style="width: 100%" v-loading="listLoading" :size="tableSize">
                <el-table-column prop="userId" label="用户ID" width="100" />
                <el-table-column prop="userName" label="用户名" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column label="角色">
                  <template #default="scope">
                    <el-tag v-if="!isEditingRole(scope.row)" :type="roleTagType(scope.row.role)">
                      {{ roleLabel(scope.row.role) }}
                    </el-tag>
                    <el-select v-else v-model="editRoleForm.role" style="width: 160px">
                      <el-option label="普通用户" value="USER" />
                      <el-option label="管理员" value="ADMIN" />
                      <el-option label="超级管理员" value="SUPER_ADMIN" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                  <template #default="scope">
                    <template v-if="!isEditingRole(scope.row)">
                      <el-button size="small" text type="primary" @click="startEditRole(scope.row)">修改角色</el-button>
                    </template>
                    <template v-else>
                      <el-button size="small" type="primary" @click="saveRole(scope.row)" :loading="roleLoading">保存</el-button>
                      <el-button size="small" @click="cancelEditRole">取消</el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-pagination">
                <el-pagination
                  background
                  layout="total, prev, pager, next, sizes"
                  :total="page.totalElements"
                  v-model:current-page="page.page"
                  v-model:page-size="page.size"
                  @current-change="loadUsers"
                  @size-change="loadUsers"
                />
              </div>
            </div>
        </div>

        <div v-show="activeTab === 'users'">
            <div class="user-panel">
              <div class="user-actions">
                <el-button type="primary" @click="openAddUser">新增用户</el-button>
              </div>
              <el-table :data="users" style="width: 100%" v-loading="listLoading" :size="tableSize">
                <el-table-column prop="userId" label="用户ID" width="100" />
                <el-table-column prop="userName" label="用户名" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="role" label="角色">
                  <template #default="scope">{{ roleLabel(scope.row.role) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                  <template #default="scope">
                    <el-button size="small" text type="primary" @click="openEditUser(scope.row)">编辑</el-button>
                    <el-button size="small" text type="danger" @click="confirmDeleteUser(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-pagination">
                <el-pagination
                  background
                  layout="total, prev, pager, next, sizes"
                  :total="page.totalElements"
                  v-model:current-page="page.page"
                  v-model:page-size="page.size"
                  @current-change="loadUsers"
                  @size-change="loadUsers"
                />
              </div>
            </div>
        </div>

        <!-- 用户新增/编辑弹窗 -->
        <el-dialog v-model="userDialogVisible" :title="userFormMode === 'add' ? '新增用户' : '编辑用户'" width="480px">
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="userForm.userName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userForm.password" placeholder="请输入密码" type="password" show-password />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email" placeholder="请输入邮箱（可选）" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="userDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitUser">确定</el-button>
            </div>
          </template>
        </el-dialog>

        <div v-show="activeTab === 'agent'">
          <AdminAgent />
        </div>

        <div v-show="activeTab === 'comments'">
          <div class="comment-admin-panel">
            <div class="comment-admin-filters">
              <el-select v-model="commentCourseFilter" placeholder="全部课程" clearable style="width: 200px" @change="loadComments">
                <el-option v-for="c in courseKeyOptions" :key="c.value" :label="c.label" :value="c.value" />
              </el-select>
              <el-button type="primary" @click="loadComments">刷新</el-button>
            </div>
            <el-table :data="adminComments" style="width: 100%" v-loading="commentLoading" :size="tableSize">
              <el-table-column prop="id" label="ID" width="70" />
              <el-table-column label="课程" width="140">
                <template #default="scope">
                  <el-tag size="small">{{ getCourseLabel(scope.row.courseKey) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="用户" width="120" />
              <el-table-column prop="content" label="评论内容" min-width="250" show-overflow-tooltip />
              <el-table-column label="时间" width="170">
                <template #default="scope">{{ formatCommentTime(scope.row.createdAt) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button size="small" text type="danger" @click="confirmDeleteComment(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-pagination">
              <span class="comment-total">共 {{ adminComments.length }} 条评论</span>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'achievements'">
          <div class="achievement-admin-panel">
            <el-table :data="adminAchievements" style="width: 100%" v-loading="achievementLoading" :size="tableSize">
              <el-table-column prop="id" label="ID" width="70" />
              <el-table-column label="图标" width="70">
                <template #default="scope">{{ scope.row.icon }}</template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="140" />
              <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
              <el-table-column prop="code" label="条件代码" width="140" />
              <el-table-column prop="conditionValue" label="条件值" width="90" />
            </el-table>
          </div>
        </div>

        <div v-show="activeTab === 'settings'">
          <el-card>
            <template #header>
              <div class="card-header">系统设置</div>
            </template>
            <el-form label-width="120px" class="settings-form">
              <el-divider content-position="left">主题与品牌</el-divider>
              <el-form-item label="主题模式">
                <el-segmented v-model="settings.themeMode" :options="themeModeOptions" class="segmented-plain" />
              </el-form-item>
              <el-form-item label="主色">
                <el-color-picker v-model="settings.primaryColor" show-alpha={false} />
              </el-form-item>
              <el-form-item label="站点标题">
                <el-input v-model="settings.siteTitle" placeholder="站点标题" />
              </el-form-item>

              <el-divider content-position="left">列表与分页</el-divider>
              <el-form-item label="默认每页条数">
                <el-select v-model="settings.pageSizeDefault" style="width: 160px">
                  <el-option :value="10" label="10" />
                  <el-option :value="20" label="20" />
                  <el-option :value="50" label="50" />
                </el-select>
              </el-form-item>
              <el-form-item label="表格密度">
                <el-radio-group v-model="settings.tableDensity">
                  <el-radio-button label="compact">紧凑</el-radio-button>
                  <el-radio-button label="normal">标准</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-divider content-position="left">仪表盘</el-divider>
              <el-form-item label="自动刷新（秒）">
                <el-select v-model="settings.dashboardRefreshSec" style="width: 160px">
                  <el-option :value="0" label="关闭" />
                  <el-option :value="30" label="30s" />
                  <el-option :value="60" label="60s" />
                </el-select>
              </el-form-item>

              <el-divider content-position="left">练习编辑器</el-divider>
              <el-form-item label="字体大小">
                <el-input-number v-model="settings.editor.fontSize" :min="10" :max="24" />
              </el-form-item>
              <el-form-item label="自动换行">
                <el-switch v-model="settings.editor.wordWrap" />
              </el-form-item>
              <el-form-item label="Minimap">
                <el-switch v-model="settings.editor.minimap" />
              </el-form-item>
              <el-form-item label="保存时格式化">
                <el-switch v-model="settings.editor.formatOnSave" />
              </el-form-item>

              <el-divider content-position="left">AI 助手</el-divider>
              <el-form-item label="显示建议">
                <el-switch v-model="settings.ai.showSuggestions" active-color="var(--el-color-primary)" inactive-color="var(--el-border-color)" />
              </el-form-item>
              <el-form-item label="超时（秒）">
                <el-input-number v-model="settings.ai.timeoutSec" :min="5" :max="60" />
              </el-form-item>

              <div class="settings-actions">
                <el-button type="primary" @click="saveSettings">保存</el-button>
                <el-button @click="resetSettings">恢复默认</el-button>
              </div>
            </el-form>
          </el-card>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getRangeTotalCount, 
  getRangeCountByKey,
  pageUsers,
  updateUserRole,
  addUser,
  editUser,
  deleteUser,
  type UserInfo
} from '@/api/user'
import { adminGetAllComments, adminDeleteComment } from '@/api/comment'
import { getAllAchievements } from '@/api/achievement'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import AdminAgent from '@/components/AdminAgent.vue'

const router = useRouter()

const goHome = () => router.push('/')
const totalChartRef = ref<HTMLElement>()
const pageChartRef = ref<HTMLElement>()
let totalChart: echarts.ECharts | null = null
let pageChart: echarts.ECharts | null = null

const active = ref('dashboard')
const activeTab = ref<'stats' | 'roles' | 'users' | 'settings' | 'agent' | 'comments' | 'achievements'>('stats')
const userStore = useUserStore()
const filterKey = ref('home')
const pageKeyOptions = [
  { label: '首页', value: 'home' },
  { label: '学习中心', value: 'learn' },
  { label: '登录', value: 'login' },
  { label: '注册', value: 'register' },
  { label: 'HTML 学习', value: 'learn-html' },
  { label: 'CSS 学习', value: 'learn-css' },
  { label: 'JavaScript 学习', value: 'learn-javascript' },
  { label: 'Vue3 学习', value: 'learn-vue3' },
  { label: 'React 学习', value: 'learn-react' },
  { label: 'TypeScript 学习', value: 'learn-typescript' },
  { label: 'TailwindCSS 学习', value: 'learn-tailwindcss' },
  { label: '个人资料', value: 'profile' },
  { label: '后台管理', value: 'admin' }
]
const dateRange = ref<[Date, Date] | null>(null)
const quickRange = ref<'yesterday' | 'today' | 'thisWeek' | 'thisMonth'>('today')
const quickOptions = [
  { label: '昨天', value: 'yesterday' },
  { label: '今天', value: 'today' },
  { label: '本周', value: 'thisWeek' },
  { label: '本月', value: 'thisMonth' }
]

const today = new Date()
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const startOfWeek = (d: Date) => {
  const day = d.getDay() || 7
  const s = addDays(startOfDay(d), -(day - 1))
  return s
}
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)

const disabledDate = (time: Date) => {
  // 禁用今天之后
  if (time.getTime() > endOfDay(today).getTime()) return true
  // 如果已选择一个端点，限制区间<=30天
  if (dateRange.value) {
    const [start, end] = dateRange.value
    if (start && !end) {
      const maxEnd = addDays(start, 30)
      if (time.getTime() > maxEnd.getTime()) return true
    }
  }
  return false
}

const shortcuts = [
  {
    text: '昨天',
    value: () => [startOfDay(addDays(today, -1)), endOfDay(addDays(today, -1))]
  },
  {
    text: '今天',
    value: () => [startOfDay(today), endOfDay(today)]
  },
  {
    text: '本周',
    value: () => [startOfWeek(today), endOfDay(today)]
  },
  {
    text: '本月',
    value: () => [startOfMonth(today), endOfDay(today)]
  }
]

const setQuickRange = (tag: typeof quickRange.value) => {
  quickRange.value = tag
  switch (tag) {
    case 'yesterday':
      dateRange.value = [startOfDay(addDays(today, -1)), endOfDay(addDays(today, -1))]
      break
    case 'today':
      dateRange.value = [startOfDay(today), endOfDay(today)]
      break
    case 'thisWeek':
      dateRange.value = [startOfWeek(today), endOfDay(today)]
      break
    case 'thisMonth':
      dateRange.value = [startOfMonth(today), endOfDay(today)]
      break
  }
}

const handleQuickChange = (val: any) => {
  setQuickRange(val)
  refreshAll()
}

const handleDateChange = () => {
  // 时间选择器变化后刷新
  refreshAll()
}

const formatDate = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const refreshAll = async () => {
  if (!dateRange.value) return
  const [start, end] = dateRange.value
  const startDate = formatDate(start)
  const endDate = formatDate(end)

  const label = `${startDate} ~ ${endDate}`

  // 总访问数（返回 number）
  const totalRes = await getRangeTotalCount(startDate, endDate)
  const totalValue = typeof totalRes.data === 'number' ? totalRes.data : 0
  renderTotalChart(label, totalValue)

  // 指定页面访问数（返回 number）
  const pageRes = await getRangeCountByKey(startDate, endDate, filterKey.value || 'home')
  const pageValue = typeof pageRes.data === 'number' ? pageRes.data : 0
  renderPageChart(label, pageValue)
}

const renderTotalChart = (label: string, value: number) => {
  if (!totalChart && totalChartRef.value) {
    totalChart = echarts.init(totalChartRef.value)
  }
  totalChart?.setOption({
    title: { text: '总访问次数（区间汇总）' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [label] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [value], label: { show: true }, itemStyle: { color: '#5470C6' } }]
  })
}

const renderPageChart = (label: string, value: number) => {
  if (!pageChart && pageChartRef.value) {
    pageChart = echarts.init(pageChartRef.value)
  }
  const pageLabel = pageKeyOptions.find(o => o.value === filterKey.value)?.label || filterKey.value
  pageChart?.setOption({
    title: { text: `页面访问次数（${pageLabel}）` },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [label] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [value], label: { show: true }, itemStyle: { color: '#91CC75' } }]
  })
}

onMounted(() => {
  setQuickRange('today')
  refreshAll()
  applySettingsToPages()
  // 进入角色/用户页时加载列表
  if (activeTab.value === 'roles' || activeTab.value === 'users') {
    loadUsers()
  }
  window.addEventListener('resize', () => {
    totalChart?.resize()
    pageChart?.resize()
  })
})

// 下拉切换页面key时刷新图表
watch(() => filterKey.value, () => {
  refreshAll()
})

watch(() => activeTab.value, (val) => {
  if (val === 'roles' || val === 'users') {
    loadUsers()
  }
  if (val === 'stats') {
    nextTick(() => {
      if (!totalChart && totalChartRef.value) totalChart = echarts.init(totalChartRef.value)
      if (!pageChart && pageChartRef.value) pageChart = echarts.init(pageChartRef.value)
      totalChart?.resize()
      pageChart?.resize()
      setTimeout(() => { totalChart?.resize(); pageChart?.resize() }, 0)
      refreshAll()
    })
  }
})

const handleSideSelect = (index: string) => {
  activeTab.value = index as any
}

// ========= 角色/用户管理 =========
const users = ref<UserInfo[]>([])
const listLoading = ref(false)
const page = ref({ page: 1, size: 10, totalElements: 0 })
// 表格尺寸绑定系统设置
const tableSize = ref<'small' | ''>('')

const loadUsers = async () => {
  listLoading.value = true
  try {
    const res = await pageUsers({ page: page.value.page - 1, size: page.value.size })
    const payload: any = res.data
    users.value = payload?.content || []
    page.value.totalElements = payload?.totalElements || 0
  } finally {
    listLoading.value = false
  }
}

// 角色编辑
const editingRoleUserId = ref<number | null>(null)
const roleLoading = ref(false)
const editRoleForm = ref<{ role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null }>({ role: null })

const isEditingRole = (row: UserInfo) => editingRoleUserId.value === row.userId
const startEditRole = (row: UserInfo) => {
  editingRoleUserId.value = row.userId
  editRoleForm.value.role = (row.role ?? null) as any
}
const cancelEditRole = () => {
  editingRoleUserId.value = null
}

const roleRank: Record<string, number> = { USER: 1, ADMIN: 2, SUPER_ADMIN: 3 }
const getRank = (r: any) => (r && roleRank[r]) ? roleRank[r] : 0
const roleLabel = (role: any) => role === 'ADMIN' ? '管理员' : role === 'SUPER_ADMIN' ? '超级管理员' : '无（普通用户）'
const roleTagType = (role: any) => role === 'SUPER_ADMIN' ? 'danger' : role === 'ADMIN' ? 'warning' : ''

const saveRole = async (row: UserInfo) => {
  const newRole = editRoleForm.value.role
  if (newRole === row.role) {
    editingRoleUserId.value = null
    return
  }
  // 权限限制：
  // 1) 同级不可改同级（当前用户role 与 目标用户role 等级相同时不可操作）
  // 2) 不能修改比自己高的权限
  // 3) 不能把他人设置为比自己更高的权限
  const currentRole = userStore.userInfo?.role ?? null
  console.log(userStore)
  const currentRank = getRank(currentRole)
  const targetRank = getRank(row.role)
  const newRank = getRank(newRole)
  if (currentRank === targetRank) {
    ElMessage.error('无权限：无法修改与自己同级的账号')
    return
  }
  if (targetRank > currentRank) {
    ElMessage.error('无权限：无法修改比自己级别高的账号')
    return
  }
  if (newRank > currentRank) {
    ElMessage.error('无权限：不可将他人设置为比自己更高的角色')
    return
  }
  // 禁止修改超级管理员（除非当前也是超管且不提升）
  if (row.role === 'SUPER_ADMIN' && currentRole !== 'SUPER_ADMIN') {
    ElMessage.error('无权限：不可修改超级管理员')
    return
  }
  roleLoading.value = true
  try {
    const res = await updateUserRole({ userId: row.userId, role: newRole as any })
    const updated = (res as any)?.data as UserInfo | undefined
    row.role = updated?.role ?? newRole ?? null
    editingRoleUserId.value = null
    ElMessage.success('角色已更新')
  } finally {
    roleLoading.value = false
  }
}

// 用户增删改
const userDialogVisible = ref(false)
const userFormMode = ref<'add' | 'edit'>('add')
const userForm = ref<{ userId?: string; userName: string; password: string; email?: string }>({ userName: '', password: '', email: '' })

const openAddUser = () => {
  userFormMode.value = 'add'
  userForm.value = { userName: '', password: '', email: '' }
  userDialogVisible.value = true
}
const openEditUser = (row: UserInfo) => {
  userFormMode.value = 'edit'
  userForm.value = { userId: String(row.userId), userName: row.userName, password: row.password || '', email: row.email || '' }
  userDialogVisible.value = true
}
const confirmDeleteUser = async (row: UserInfo) => {
  try {
    await ElMessageBox.confirm(`确认删除用户【${row.userName}】吗？`, '提示', { type: 'warning' })
    await deleteUser(String(row.userId))
    ElMessage.success('已删除')
    loadUsers()
  } catch {}
}
const submitUser = async () => {
  if (userFormMode.value === 'add') {
    await addUser({ userName: userForm.value.userName, password: userForm.value.password, email: userForm.value.email })
    ElMessage.success('新增成功')
  } else {
    await editUser({ userId: userForm.value.userId!, userName: userForm.value.userName, password: userForm.value.password, email: userForm.value.email })
    ElMessage.success('修改成功')
  }
  userDialogVisible.value = false
  loadUsers()
}

// ========= 评论管理 =========
const adminComments = ref<any[]>([])
const commentLoading = ref(false)
const commentCourseFilter = ref('')

const courseKeyOptions = [
  { label: 'HTML 基础', value: 'html' },
  { label: 'CSS 样式', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Vue3 框架', value: 'vue3' },
  { label: 'React 框架', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'TailwindCSS', value: 'tailwindcss' }
]

const courseLabelMap: Record<string, string> = {
  html: 'HTML 基础',
  css: 'CSS 样式',
  javascript: 'JavaScript',
  vue3: 'Vue3 框架',
  react: 'React 框架',
  typescript: 'TypeScript',
  tailwindcss: 'TailwindCSS'
}

function getCourseLabel(key: string) {
  return courseLabelMap[key] || key
}

function formatCommentTime(time: string | null) {
  if (!time) return '-'
  const d = new Date(time)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function loadComments() {
  commentLoading.value = true
  try {
    const res: any = await adminGetAllComments(commentCourseFilter.value || undefined)
    adminComments.value = res?.data || []
  } finally {
    commentLoading.value = false
  }
}

async function confirmDeleteComment(row: any) {
  try {
    await ElMessageBox.confirm(`确认删除【${row.userName}】在${getCourseLabel(row.courseKey)}的这条评论吗？`, '删除评论', { type: 'warning' })
    await adminDeleteComment(row.id)
    ElMessage.success('已删除')
    loadComments()
  } catch {}
}

watch(() => activeTab.value, (val) => {
  if (val === 'comments') loadComments()
  if (val === 'achievements') loadAchievements()
})

// ========= 成就管理 =========
const adminAchievements = ref<any[]>([])
const achievementLoading = ref(false)

async function loadAchievements() {
  achievementLoading.value = true
  try {
    const res: any = await getAllAchievements()
    adminAchievements.value = res?.data || []
  } finally {
    achievementLoading.value = false
  }
}

// 将系统设置应用到当前页（表格尺寸、默认分页、仪表盘刷新）
function applySettingsToPages(){
  try {
    const sRaw = localStorage.getItem('appSettings')
    const s = sRaw ? JSON.parse(sRaw) : {}
    // 表格密度 -> Element Plus size
    tableSize.value = s.tableDensity === 'compact' ? 'small' : ''
    // 默认分页大小
    if (s.pageSizeDefault && typeof s.pageSizeDefault === 'number') {
      page.value.size = s.pageSizeDefault
    }
    // 仪表盘自动刷新
    if (autoTimer) clearInterval(autoTimer)
    if (activeTab.value === 'stats') {
      const sec = Number(s.dashboardRefreshSec || 0)
      if (sec > 0) {
        autoTimer = setInterval(() => { refreshAll() }, sec * 1000)
      }
    }
  } catch {}
}

let autoTimer: any = null
watch(() => activeTab.value, () => applySettingsToPages())

// ========= 系统设置 =========
type Settings = {
  themeMode: 'auto' | 'light' | 'dark'
  primaryColor: string
  siteTitle: string
  pageSizeDefault: number
  tableDensity: 'compact' | 'normal'
  dashboardRefreshSec: number
  editor: { fontSize: number; wordWrap: boolean; minimap: boolean; formatOnSave: boolean }
  ai: { showSuggestions: boolean; timeoutSec: number }
}

const themeStore = useThemeStore()
const SETTINGS_KEY = 'appSettings'
const defaultSettings: Settings = {
  themeMode: (localStorage.getItem('theme') as any) ? ((localStorage.getItem('theme') as any) as 'light'|'dark') : 'auto',
  primaryColor: localStorage.getItem('primaryColor') || '#3b82f6',
  siteTitle: '前端学习网站',
  pageSizeDefault: 10,
  tableDensity: 'normal',
  dashboardRefreshSec: 60,
  editor: { fontSize: 14, wordWrap: true, minimap: false, formatOnSave: true },
  ai: { showSuggestions: true, timeoutSec: 15 }
}
const settings = reactive<Settings>({ ...defaultSettings, ...safeReadSettings() })

const themeModeOptions = [
  { label: '自动', value: 'auto' },
  { label: '明亮', value: 'light' },
  { label: '暗黑', value: 'dark' }
]

function safeReadSettings(): Partial<Settings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  ElMessage.success('设置已保存')
  applySettings()
}

function resetSettings() {
  Object.assign(settings, defaultSettings)
  saveSettings()
}

function applySettings() {
  // 主题模式
  if (settings.themeMode === 'auto') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ;(themeStore as any).isDark = prefersDark
  } else {
    ;(themeStore as any).isDark = (settings.themeMode === 'dark')
  }
  localStorage.setItem('theme', (themeStore as any).isDark ? 'dark' : 'light')
  themeStore.initTheme()
  // 主色
  themeStore.setPrimaryColor(settings.primaryColor)
  // 站点标题后缀
  if (document && document.title) {
    const parts = document.title.split(' - ')
    document.title = `${parts[0]} - ${settings.siteTitle}`
  }
  // 其他设置放入 localStorage
  localStorage.setItem('pageSizeDefault', String(settings.pageSizeDefault))
  localStorage.setItem('tableDensity', settings.tableDensity)
  localStorage.setItem('dashboardRefreshSec', String(settings.dashboardRefreshSec))
  localStorage.setItem('editorSettings', JSON.stringify(settings.editor))
  localStorage.setItem('aiSettings', JSON.stringify(settings.ai))
}

watch(() => settings.themeMode, applySettings)
watch(() => settings.primaryColor, applySettings)
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.title {
  margin: 0 0 6px 0;
  font-size: 28px;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
}

.header-actions { margin-top: 8px; }

.home-btn {
  --btn-bg: rgba(255,255,255,0.18);
  --btn-border: rgba(255,255,255,0.35);
  --btn-text: #fff;
  backdrop-filter: saturate(160%) blur(6px);
  background: var(--btn-bg);
  color: var(--btn-text);
  border: 1px solid var(--btn-border);
  border-radius: 999px;
}
.home-btn:hover { --btn-bg: rgba(255,255,255,0.28); --btn-border: rgba(255,255,255,0.6); }
.dark .home-btn { --btn-bg: rgba(0,0,0,0.18); --btn-border: rgba(255,255,255,0.28); --btn-text: #fff; }
.dark .home-btn:hover { --btn-bg: rgba(0,0,0,0.28); --btn-border: rgba(255,255,255,0.45); }

.admin-main {
  flex: 1;
  display: grid;
  grid-template-columns: 240px 1fr;
}

.sidebar {
  border-right: 1px solid #eee;
  background: #fafafa;
}

.content {
  padding: 24px;
}

.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.chart-box {
  height: 360px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.table-pagination { margin-top: 12px; }
.user-actions { margin-bottom: 12px; }

.comment-admin-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.comment-total {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* 系统设置面板可见性与对比度优化 */
:deep(.segmented-plain .el-segmented__item.is-selected) {
  background: var(--el-color-primary);
  color: #fff;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.25) inset;
  font-weight: 600;
}
:deep(.el-switch.is-checked .el-switch__core) {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.25) inset;
}

/* segmented 基础态与未选中态（明亮/暗黑分别适配） */
:deep(.segmented-plain .el-segmented) {
  background: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
}
:deep(.segmented-plain .el-segmented__item) {
  color: var(--el-text-color-regular);
}

/* 开关在开启状态下提高清晰度（旋钮描边与对比） */
:deep(.el-switch.is-checked .el-switch__core:after) {
  box-shadow: 0 0 0 1px rgba(255,255,255,0.35) inset;
}

/* 标签与输入可读性（避免白底白字） */
:deep(.el-form-item__label) { color: var(--el-text-color-regular); }
:deep(.el-input__inner), :deep(.el-select .el-input__inner) { color: var(--el-text-color-primary); }

.dark .sidebar {
  background: #1f2937;
  border-right-color: #374151;
}

.dark .content {
  background: #111827;
}
</style>


