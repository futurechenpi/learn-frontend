<template>
  <div class="notes-page">
    <div class="notes-container">
      <header class="page-header">
        <div class="header-left">
          <el-button @click="router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </el-button>
          <div class="title-group">
            <h2>📝 我的笔记</h2>
            <p class="subtitle">记录学习心得，巩固知识点</p>
          </div>
        </div>
        <div class="header-right">
          <el-select v-model="filterCourse" placeholder="全部课程" clearable style="width: 180px" @click.stop @change="loadNotes">
            <el-option v-for="c in courseOptions" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
          <span v-if="notes.length > 0" class="count-badge">共 {{ notes.length }} 条笔记</span>
        </div>
      </header>

      <div v-if="loading" class="loading-wrap">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else-if="notes.length === 0" class="empty-state">
        <p>还没有笔记，去课程页面记录学习心得吧~</p>
        <el-button type="primary" @click="$router.push('/learn')">去学习中心</el-button>
      </div>

      <div v-else class="notes-grid">
        <div v-for="note in notes" :key="note.id" class="note-card" @click="goToCourse(note.courseKey)">
          <div class="note-card-top">
            <el-tag size="small">{{ courseNameMap[note.courseKey] || note.courseKey }}</el-tag>
            <span class="note-time">{{ formatTime(note.updatedAt) }}</span>
          </div>
          <h3 class="note-card-title">{{ note.title }}</h3>
          <p class="note-card-content">{{ note.content.slice(0, 200) }}{{ note.content.length > 200 ? '...' : '' }}</p>
          <div class="note-card-footer">
            <span class="note-source">来自 {{ courseNameMap[note.courseKey] || note.courseKey }} {{ note.lessonStep ? `第${note.lessonStep}课` : '' }}</span>
            <el-button size="small" text type="danger" @click.stop="handleDelete(note)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getNotes, deleteNote } from '@/api/note'
import type { NoteItem } from '@/api/note'

const router = useRouter()
const userStore = useUserStore()

const notes = ref<NoteItem[]>([])
const loading = ref(false)
const filterCourse = ref('')

const courseOptions = [
  { label: 'HTML 基础', value: 'html' },
  { label: 'CSS 样式', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Vue3 框架', value: 'vue3' },
  { label: 'React 框架', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'TailwindCSS', value: 'tailwindcss' }
]

const courseNameMap: Record<string, string> = {
  html: 'HTML 基础',
  css: 'CSS 样式',
  javascript: 'JavaScript',
  vue3: 'Vue3 框架',
  react: 'React 框架',
  typescript: 'TypeScript',
  tailwindcss: 'TailwindCSS'
}

function formatTime(time: string) {
  const d = new Date(time)
  return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function loadNotes() {
  if (!userStore.userInfo?.userId) return
  loading.value = true
  try {
    const res: any = await getNotes(userStore.userInfo.userId, filterCourse.value || undefined)
    notes.value = res?.data || []
  } finally {
    loading.value = false
  }
}

function goToCourse(courseKey: string) {
  const routeMap: Record<string, string> = {
    html: '/learn/html', css: '/learn/css', javascript: '/learn/javascript',
    vue3: '/learn/vue3', react: '/learn/react', typescript: '/learn/typescript', tailwindcss: '/learn/tailwindcss'
  }
  router.push(routeMap[courseKey] || '/learn')
}

async function handleDelete(note: NoteItem) {
  await ElMessageBox.confirm('确定删除这条笔记吗？', '提示', { type: 'warning' })
  try {
    await deleteNote(note.id)
    ElMessage.success('已删除')
    loadNotes()
  } catch {}
}

onMounted(loadNotes)
</script>

<style scoped>
.notes-page { min-height: 100vh; background: #f5f7fa; padding: 24px; }
.dark .notes-page { background: #111827; }
.notes-container { max-width: 960px; margin: 0 auto; }

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

.title-group h2 { margin: 0; font-size: 24px; color: #1f2937; }
.dark .title-group h2 { color: #e5e7eb; }

.subtitle {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 4px 0 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}
.dark .count-badge { background: rgba(59,130,246,0.15); color: #60a5fa; }

.loading-wrap, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: #9ca3af;
}
.dark .loading-wrap, .dark .empty-state { background: #1e1e1e; }
.empty-state p { font-size: 16px; margin-bottom: 16px; }

.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

.note-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.dark .note-card { background: #1f2937; border-color: #374151; }
.note-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

.note-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.note-time { font-size: 12px; color: #9ca3af; }

.note-card-title { font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0; }
.dark .note-card-title { color: #e5e7eb; }

.note-card-content {
  margin: 0 0 14px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dark .note-card-content { color: #d1d5db; }

.note-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}
.note-source { font-size: 12px; color: #9ca3af; }
</style>
