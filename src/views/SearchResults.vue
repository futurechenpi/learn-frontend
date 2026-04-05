<template>
  <div class="search-page">
    <div class="search-container">
      <header class="page-header">
        <div class="header-left">
          <el-button @click="router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </el-button>
          <div class="title-group">
            <h2>🔍 搜索结果</h2>
            <p v-if="query" class="subtitle">关键词："<strong>{{ query }}</strong>"</p>
          </div>
        </div>
        <div v-if="allResults.length > 0" class="header-right">
          <span class="count-badge">共 {{ allResults.length }} 条结果</span>
        </div>
      </header>

      <div class="search-bar">
        <el-input
          v-model="query"
          size="large"
          placeholder="搜索课程、笔记、评论..."
          prefix-icon="Search"
          clearable
          @keyup.enter="doSearch"
        >
          <template #append>
            <el-button @click="doSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div v-if="loading" class="loading-wrap"><el-skeleton :rows="6" animated /></div>

      <div v-else-if="!searched">
        <div class="empty-state">
          <p>输入关键词开始搜索</p>
        </div>
      </div>

      <div v-else-if="allResults.length === 0" class="empty-state">
        <p>未找到 "{{ query }}" 相关内容</p>
      </div>

      <div v-else class="results-sections">
        <div v-if="courseResults.length > 0" class="result-section">
          <h3>📖 课程内容 ({{ courseResults.length }})</h3>
          <div class="result-list">
            <div v-for="(item, idx) in courseResults" :key="'c'+idx" class="result-card" @click="go(item.route)">
              <h4>{{ item.title }}</h4>
              <p>{{ item.matchText }}</p>
              <span class="goto">点击跳转 →</span>
            </div>
          </div>
        </div>

        <div v-if="noteResults.length > 0" class="result-section">
          <h3>📝 笔记 ({{ noteResults.length }})</h3>
          <div class="result-list">
            <div v-for="(item, idx) in noteResults" :key="'n'+idx" class="result-card" @click="$router.push('/notes')">
              <h4>{{ item.title }}</h4>
              <p>{{ item.matchText }}</p>
              <span class="goto">查看笔记 →</span>
            </div>
          </div>
        </div>

        <div v-if="commentResults.length > 0" class="result-section">
          <h3>💬 评论 ({{ commentResults.length }})</h3>
          <div class="result-list">
            <div v-for="(item, idx) in commentResults" :key="'m'+idx" class="result-card">
              <h4>{{ item.title }}</h4>
              <p>{{ item.matchText }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getNotes } from '@/api/note'
import { getCommentList } from '@/api/comment'
import { useUserStore } from '@/stores/user'
import { allConfigs, type CourseConfig } from '@/views/learn/courseConfig'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const query = ref('')
const loading = ref(false)
const searched = ref(false)
const courseResults = ref<any[]>([])
const noteResults = ref<any[]>([])
const commentResults = ref<any[]>([])
const allResults = ref<any[]>([])

interface SearchResult {
  type: string
  title: string
  matchText: string
  route?: string
}

function doSearch() {
  if (!query.value.trim()) return
  loading.value = true
  searched.value = true

  const q = query.value.trim()
  const cRes: SearchResult[] = []
  const nRes: SearchResult[] = []
  const mRes: SearchResult[] = []

  const courseNameMap: Record<string, string> = {
    html: 'HTML 基础', css: 'CSS 样式', javascript: 'JavaScript',
    vue3: 'Vue3 框架', react: 'React 框架', typescript: 'TypeScript', tailwindcss: 'TailwindCSS'
  }

  for (const [key, config] of Object.entries(allConfigs) as [string, CourseConfig][]) {
    for (const lesson of config.lessons) {
      const text = `${lesson.title} ${lesson.content} ${lesson.codeExample || ''} ${lesson.exercise?.description || ''}`
      if (text.toLowerCase().includes(q.toLowerCase())) {
        cRes.push({
          type: 'course',
          title: `${courseNameMap[key]} - ${lesson.title}`,
          matchText: text.slice(0, 150),
          route: `/learn/${key}`
        })
      }
    }
  }

  Promise.all([
    userStore.userInfo?.userId ? getNotes(userStore.userInfo.userId).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
    getCommentList('html').catch(() => ({ data: [] }))
  ]).then(([notesData, commentsData]: any[]) => {
    const notes = notesData?.data || []
    const comments = commentsData?.data || []

    for (const n of notes) {
      const text = `${n.title} ${n.content}`
      if (text.toLowerCase().includes(q.toLowerCase())) {
        nRes.push({ type: 'note', title: `笔记：${n.title}`, matchText: n.content.slice(0, 150) })
      }
    }

    for (const c of comments) {
      const text = `${c.userName} ${c.content}`
      if (text.toLowerCase().includes(q.toLowerCase())) {
        mRes.push({ type: 'comment', title: `${c.userName} 的评论`, matchText: c.content.slice(0, 150) })
      }
    }

    courseResults.value = cRes
    noteResults.value = nRes
    commentResults.value = mRes
    allResults.value = [...cRes, ...nRes, ...mRes]
    loading.value = false
  })

  router.replace({ query: { q: q } })
}

function go(path?: string) {
  if (path) router.push(path)
}

onMounted(() => {
  const q = route.query.q as string
  if (q) { query.value = q; doSearch() }
})
</script>

<style scoped>
.search-page {  background: #f5f7fa; padding: 24px; }
.dark .search-page { background: #111827; }
.search-container { max-width: 900px; margin: 0 auto; }

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
  margin: 0;
  font-size: 24px;
  color: #1f2937;
}
.dark .title-group h2 { color: #e5e7eb; }

.subtitle {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 4px 0 0 0;
}
.subtitle strong {
  color: #3b82f6;
}

.header-right {
  display: flex;
  align-items: center;
}

.count-badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}
.dark .count-badge { background: rgba(16,185,129,0.15); color: #34d399; }

.search-bar { margin-bottom: 28px; }

.loading-wrap, .empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); color: #9ca3af; font-size: 16px; }
.dark .loading-wrap, .dark .empty-state { background: #1e1e1e; }

.result-section { margin-bottom: 28px; }
.result-section h3 {
  font-size: 17px;
  color: #374151;
  margin: 0 0 14px 0;
}
.dark .result-section h3 { color: #e5e7eb; }

.result-list { display: flex; flex-direction: column; gap: 10px; }

.result-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.2s;
}
.dark .result-card { background: #1f2937; border-color: #374151; }
.result-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

.result-card h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px 0;
}
.dark .result-card h4 { color: #e5e7eb; }

.result-card p {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dark .result-card p { color: #d1d5db; }

.goto {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
}
</style>
