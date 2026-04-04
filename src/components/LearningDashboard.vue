<template>
  <div class="learning-dashboard">
    <div class="dashboard-stats">
      <div class="stat-card overall">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <span class="stat-value">{{ dashboard.overallProgress || 0 }}%</span>
          <span class="stat-label">总体进度</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <span class="stat-value">{{ dashboard.completedCourses || 0 }}/{{ dashboard.totalCourses || 7 }}</span>
          <span class="stat-label">已完成课程</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <span class="stat-value">{{ dashboard.learningDays || 0 }}</span>
          <span class="stat-label">学习天数</span>
        </div>
      </div>
    </div>

    <div class="course-progress-section">
      <h4>课程进度</h4>
      <div class="course-bars">
        <div v-for="cp in courseProgressList" :key="cp.courseKey" class="course-bar-item">
          <div class="bar-header">
            <span class="course-name">{{ courseNameMap[cp.courseKey] || cp.courseKey }}</span>
            <span class="percent-text">{{ cp.percent }}%</span>
          </div>
          <el-progress
            :percentage="cp.percent"
            :stroke-width="10"
            :color="getProgressColor(cp.percent)"
            :show-text="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboardStats } from '@/api/dashboard'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const dashboard = ref<any>({})
const courseProgressList = ref<any[]>([])

const courseNameMap: Record<string, string> = {
  html: 'HTML 基础',
  css: 'CSS 样式',
  javascript: 'JavaScript',
  vue3: 'Vue3 框架',
  react: 'React 框架',
  typescript: 'TypeScript',
  tailwindcss: 'TailwindCSS'
}

function getProgressColor(percent: number) {
  if (percent >= 100) return '#67c23a'
  if (percent >= 60) return '#409eff'
  if (percent >= 30) return '#e6a23c'
  return '#f56c6c'
}

async function loadDashboard() {
  if (!userStore.userInfo?.userId) return
  try {
    const res: any = await getDashboardStats(userStore.userInfo.userId)
    dashboard.value = res?.data || {}
    courseProgressList.value = dashboard.value.courseProgress || []
  } catch {}
}

onMounted(loadDashboard)

defineExpose({ refresh: loadDashboard })
</script>

<style scoped>
.learning-dashboard { margin-top: 20px; }
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.stat-card.overall {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(147, 197, 253, 0.35);
}
.stat-icon { font-size: 28px; }
.stat-info { display: flex; flex-direction: column; }
.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 2px;
}

.course-progress-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 14px 0;
}

.course-bars { display: flex; flex-direction: column; gap: 12px; }
.course-bar-item { padding: 8px 0; }
.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.course-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}
.percent-text {
  font-size: 13px;
  font-weight: 600;
  color: #93c5fd;
}
</style>
