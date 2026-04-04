<template>
  <div class="global-search" :class="{ active: focused || keyword }">
    <el-input
      v-model="keyword"
      placeholder="搜索课程、笔记、评论..."
      prefix-icon="Search"
      clearable
      size="default"
      class="search-input"
      @focus="focused = true"
      @blur="handleBlur"
      @keyup.enter="goSearch"
    />
    <div v-if="focused && keyword && results.length > 0" class="search-dropdown" @mousedown.prevent>
      <div v-if="results.length > 0" class="search-results">
        <div v-for="(item, idx) in results.slice(0, 8)" :key="idx" class="result-item" @click="goToResult(item)">
          <span class="result-type">{{ typeLabel(item.type) }}</span>
          <span class="result-title">{{ item.title }}</span>
          <span class="result-match">{{ item.matchText }}</span>
        </div>
        <div v-if="results.length > 8" class="more-hint">
          还有 {{ results.length - 8 }} 条结果，按回车查看全部
        </div>
      </div>
      <div v-else-if="keyword && !loading && results.length === 0" class="no-result">
        未找到相关内容
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import { getNotes } from '@/api/note'
import { getCommentList } from '@/api/comment'
import { useUserStore } from '@/stores/user'
import { allConfigs, type CourseConfig } from '@/views/learn/courseConfig'

const router = useRouter()
const userStore = useUserStore()
const keyword = ref('')
const focused = ref(false)
const loading = ref(false)
const results = ref<any[]>([])

interface SearchResult {
  type: 'course' | 'note' | 'comment'
  title: string
  matchText: string
  route?: string
  courseKey?: string
}

let fuse: Fuse<SearchResult> | null = null

function buildIndex() {
  const allData: SearchResult[] = []

  for (const [key, config] of Object.entries(allConfigs) as [string, CourseConfig][]) {
    const courseNameMap: Record<string, string> = {
      html: 'HTML 基础', css: 'CSS 样式', javascript: 'JavaScript',
      vue3: 'Vue3 框架', react: 'React 框架', typescript: 'TypeScript', tailwindcss: 'TailwindCSS'
    }
    for (const lesson of config.lessons) {
      allData.push({
        type: 'course',
        title: `${courseNameMap[key] || key} - ${lesson.title}`,
        matchText: `${lesson.content} ${lesson.codeExample || ''} ${lesson.exercise?.description || ''}`,
        route: `/learn/${key}`,
        courseKey: key
      })
    }
  }

  fuse = new Fuse(allData, {
    keys: ['title', 'matchText'],
    threshold: 0.35,
    includeMatches: true,
    minMatchCharLength: 1
  })
}

buildIndex()

async function doSearch(query: string) {
  if (!query.trim()) { results.value = []; return }

  const localResults = fuse?.search(query).map(r => ({
    type: r.item.type,
    title: r.item.title,
    matchText: extractMatch(r),
    route: r.item.route,
    courseKey: r.item.courseKey
  })) || []

  let noteResults: SearchResult[] = []
  let commentResults: SearchResult[] = []

  if (userStore.isLoggedIn && userStore.userInfo?.userId) {
    try {
      const notesRes: any = await getNotes(userStore.userInfo.userId)
      if (notesRes?.data) {
        const noteFuse = new Fuse(notesRes.data, { keys: ['title', 'content'], threshold: 0.4 })
        noteResults = noteFuse.search(query).map(r => ({
          type: 'note' as const,
          title: `笔记：${r.item.title}`,
          matchText: r.item.content.slice(0, 80),
          route: '/notes'
        }))
      }
    } catch {}
    try {
      const commentRes: any = await getCommentList('html')
      if (commentRes?.data) {
        const commentFuse = new Fuse(commentRes.data, { keys: ['userName', 'content'], threshold: 0.4 })
        commentResults = commentFuse.search(query).map(r => ({
          type: 'comment' as const,
          title: `评论：${r.item.userName}`,
          matchText: r.item.content.slice(0, 80),
          route: undefined
        }))
      }
    } catch {}
  }

  results.value = [...localResults, ...noteResults, ...commentResults]
}

function extractMatch(result: Fuse.FuseResult<SearchResult>): string {
  const match = result.matches?.[0]
  if (!match?.indices?.length) return ''
  const text = result.item.matchText
  const [start, end] = match.indices[0]
  return '...' + text.slice(Math.max(0, start - 10), end + 30) + '...'
}

function typeLabel(type: string) {
  const map: Record<string, string> = { course: '📖 课程', note: '📝 笔记', comment: '💬 评论' }
  return map[type] || type
}

function goToResult(item: SearchResult) {
  if (item.route) router.push(item.route)
  keyword.value = ''
  focused.value = false
}

function goSearch() {
  if (keyword.value.trim()) {
    router.push({ path: '/search', query: { q: keyword.value.trim() } })
    focused.value = false
  }
}

function handleBlur() {
  setTimeout(() => { focused.value = false }, 200)
}

watch(keyword, (val) => {
  if (val.length >= 1) doSearch(val)
  else results.value = []
})
</script>

<style scoped>
.global-search { position: relative; width: 320px; }
.global-search.active .search-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-primary);
}
.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
}
.dark .search-dropdown { background: #1f2937; border: 1px solid #374151; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4); }
.search-results { max-height: 400px; overflow-y: auto; }
.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.result-item:hover { background: #f3f4f6; }
.dark .result-item:hover { background: #374151; }
.result-type {
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}
.result-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}
.dark .result-title { color: #e5e7eb; }
.result-match {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.more-hint {
  padding: 8px 14px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  border-top: 1px solid #eee;
}
.no-result { padding: 20px; text-align: center; color: #9ca3af; font-size: 13px; }
</style>
