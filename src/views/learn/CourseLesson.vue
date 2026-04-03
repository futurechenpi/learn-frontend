<template>
  <div class="course-learn">
    <div class="learn-container">
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {{ config.pageName }}
          </h2>
          <div class="progress-info">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              进度: {{ currentStep }}/{{ config.totalSteps }}
            </span>
            <el-progress
              :percentage="progressPercentage"
              :stroke-width="8"
              :show-text="false"
              class="progress-bar"
            />
          </div>
        </div>
      </div>

      <div class="content-section">
        <div class="content-card">
          <div class="content-header">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {{ currentLesson.title }}
            </h3>
            <div class="lesson-meta">
              <el-tag :type="currentLesson.difficulty === '入门' ? 'success' : 'warning'">
                {{ currentLesson.difficulty }}
              </el-tag>
              <span class="text-sm text-gray-500 dark:text-gray-500">
                预计学习时间: {{ currentLesson.duration }}
              </span>
              <button
                v-if="userStore.isLoggedIn"
                :class="['fav-btn', { 'is-fav': isFavorited }]"
                @click="handleToggleFav"
                :disabled="togglingFav"
              >
                {{ isFavorited ? '★ 已收藏' : '☆ 收藏' }}
              </button>
            </div>
          </div>

          <div class="content-body">
            <div class="lesson-content" v-html="currentLesson.content"></div>

            <div v-if="currentLesson.codeExample" class="code-example">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">代码示例</h4>
              <CodeHighlighter
                :code="currentLesson.codeExample"
                :language="config.codeLanguage"
                :title="config.codeLanguage.toUpperCase() + ' 代码'"
              />
              <div v-if="!config.hasExerciseSection" class="mt-3 flex gap-2">
                <el-button type="primary" @click="goExercise">开始练习</el-button>
                <el-button @click="goAIExercise">AI出题</el-button>
              </div>
            </div>

            <div v-if="config.hasExerciseSection && currentLesson.exercise" class="exercise-section">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">实践练习</h4>
              <div class="exercise-content">
                <p class="text-gray-600 dark:text-gray-400 mb-4">{{ currentLesson.exercise.description }}</p>
                <div class="exercise-actions">
                  <el-button type="primary" @click="goExercise">开始练习</el-button>
                  <el-button @click="goAIExercise">AI出题</el-button>
                </div>
              </div>
            </div>

            <div v-if="config.hasPreview && currentLesson.preview" class="preview-section">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">效果预览</h4>
              <div class="preview-content" v-html="currentLesson.preview"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation-section">
        <div class="nav-buttons">
          <el-button
            :disabled="currentStep === 1"
            @click="previousLesson"
          >
            上一课
          </el-button>

          <div class="step-indicators">
            <el-button
              v-for="step in config.totalSteps"
              :key="step"
              :type="step === currentStep ? 'primary' : 'default'"
              :size="step === currentStep ? 'default' : 'small'"
              circle
              @click="goToStep(step)"
            >
              {{ step }}
            </el-button>
          </div>

          <el-button
            type="primary"
            :disabled="currentStep === config.totalSteps"
            @click="nextLesson"
          >
            {{ currentStep === config.totalSteps ? '完成' : '下一课' }}
          </el-button>
        </div>
      </div>

      <CommentSection ref="commentSectionRef" :course-key="config.progressKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CodeHighlighter from '@/components/CodeHighlighter.vue'
import CommentSection from '@/components/CommentSection.vue'
import { useUserStore } from '@/stores/user'
import { getUserProgress, saveUserProgress } from '@/api/progress'
import { checkFavorite, toggleFavorite } from '@/api/favorite'
import { usePageContext } from '@/composables/usePageContext'
import type { CourseConfig } from './courseConfig'

const props = defineProps<{
  config: CourseConfig
}>()

const router = useRouter()
const userStore = useUserStore()
const { setContext } = usePageContext()
const currentStep = ref(1)
const commentSectionRef = ref<InstanceType<typeof CommentSection>>()

const isFavorited = ref(false)
const togglingFav = ref(false)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / props.config.totalSteps) * 100)
})

const currentLesson = computed(() => {
  return props.config.lessons[currentStep.value - 1]
})

const updatePageContext = () => {
  const lesson = props.config.lessons[currentStep.value - 1]
  if (!lesson) return
  setContext({
    pageName: props.config.pageName,
    routeName: props.config.routeName,
    lessonTitle: lesson.title,
    lessonStep: currentStep.value,
    lessonTotalSteps: props.config.totalSteps,
    contentSummary: lesson.content
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500),
    codeExample: lesson.codeExample,
  })
}

watch(currentStep, () => updatePageContext())

const previousLesson = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    persistProgress()
  }
}

const nextLesson = () => {
  if (currentStep.value < props.config.totalSteps) {
    currentStep.value++
    persistProgress()
  } else {
    ElMessage.success(props.config.completionMessage)
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
  persistProgress()
}

const goExercise = () => {
  const routeParams: any = { step: currentStep.value }
  const routeQuery: any = {
    code: currentLesson.value?.codeExample || '',
    lang: props.config.codeLanguage === 'react' ? 'jsx' : props.config.codeLanguage,
    title: currentLesson.value?.title || ''
  }

  if (props.config.exerciseRouteName === 'exercise') {
    routeParams.course = props.config.progressKey
  }

  router.push({
    name: props.config.exerciseRouteName,
    params: routeParams,
    query: routeQuery
  })
}

const goAIExercise = () => {
  router.push({
    name: 'ai-exercise',
    params: { course: props.config.aiCourseName }
  })
}

async function handleToggleFav() {
  togglingFav.value = true
  try {
    const res: any = await toggleFavorite(props.config.progressKey, props.config.pageName)
    isFavorited.value = res?.data?.favorited || !isFavorited.value
    ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '操作失败')
  }
  togglingFav.value = false
}

async function loadFavoriteStatus() {
  if (!userStore.isLoggedIn) return
  try {
    const res: any = await checkFavorite(props.config.progressKey)
    isFavorited.value = !!res?.data
  } catch {}
}

async function persistProgress() {
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      await saveUserProgress({
        userId: userStore.userInfo.userId,
        course: props.config.progressKey,
        step: currentStep.value
      })
    }
  } catch {}
}

onMounted(async () => {
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      const res = await getUserProgress(userStore.userInfo.userId)
      const s = (res?.data as any)?.[props.config.progressKey]
      if (typeof s === 'number' && s >= 1 && s <= props.config.totalSteps) {
        currentStep.value = s
      }
    }
  } catch {}
  updatePageContext()
  loadFavoriteStatus()
})
</script>

<style scoped>
.course-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .course-learn {
  background: #1a1a1a;
}

.learn-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.progress-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .progress-section {
  background: #2d2d2d;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 200px;
}

.progress-bar {
  width: 200px;
}

.content-section {
  margin-bottom: 24px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .content-card {
  background: #2d2d2d;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.dark .content-header {
  border-bottom-color: #444;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fav-btn {
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.25s ease;
}
.fav-btn:hover { border-color: #f59e0b; color: #f59e0b; }
.fav-btn.is-fav {
  border-color: #f59e0b;
  background: #fffbeb;
  color: #d97706;
}
.dark .fav-btn {
  border: #4b5563;
  background: transparent;
  color: #9ca3af;
}
.dark .fav-btn.is-fav {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
}

.content-body {
  color: #333;
  line-height: 1.8;
}

.dark .content-body {
  color: #ddd;
}

.lesson-content {
  margin-bottom: 24px;
}

.lesson-content :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #1f2937;
}

.dark .lesson-content :deep(h4) {
  color: #e5e7eb;
}

.lesson-content :deep(p) {
  margin: 8px 0;
}

.lesson-content :deep(ul),
.lesson-content :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.lesson-content :deep(li) {
  margin: 4px 0;
}

.lesson-content :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.dark .lesson-content :deep(code) {
  background: #374151;
}

.code-example,
.preview-section,
.exercise-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.dark .code-example,
.dark .preview-section,
.dark .exercise-section {
  border-top-color: #444;
}

.preview-content {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.dark .preview-content {
  background: #1f2937;
  border-color: #374151;
}

.navigation-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .navigation-section {
  background: #2d2d2d;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.step-indicators {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 400px;
}

:deep(.el-card__body) {
  padding: 16px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>
