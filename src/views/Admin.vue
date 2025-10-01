<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1 class="title">后台管理</h1>
      <p class="subtitle">结构占位（内容后续完善）</p>
    </header>

    <main class="admin-main">
      <aside class="sidebar">
        <el-menu :default-active="activeTab" class="menu" @select="handleSideSelect">
          <el-menu-item index="stats">访问统计</el-menu-item>
          <el-menu-item index="roles">角色权限</el-menu-item>
          <el-menu-item index="users">用户管理</el-menu-item>
          <el-menu-item index="settings">系统设置</el-menu-item>
          <el-menu-item index="agent">智能体（陈刚）</el-menu-item>
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
              <el-table :data="users" style="width: 100%" v-loading="listLoading">
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
              <el-table :data="users" style="width: 100%" v-loading="listLoading">
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
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
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
import { useUserStore } from '@/stores/user'
import AdminAgent from '@/components/AdminAgent.vue'

const totalChartRef = ref<HTMLElement>()
const pageChartRef = ref<HTMLElement>()
let totalChart: echarts.ECharts | null = null
let pageChart: echarts.ECharts | null = null

const active = ref('dashboard')
const activeTab = ref<'stats' | 'roles' | 'users' | 'settings' | 'agent'>('stats')
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

.dark .sidebar {
  background: #1f2937;
  border-right-color: #374151;
}

.dark .content {
  background: #111827;
}
</style>


