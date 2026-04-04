<template>
  <div class="ai-exercise">
    <div class="exercise-container">
      <div class="exercise-header">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          AI 智能出题
        </h2>
        <div class="header-controls">
          <el-select v-model="selectedCourse" placeholder="选择课程" class="course-select">
            <el-option label="HTML" value="HTML" />
            <el-option label="CSS" value="CSS" />
            <el-option label="JavaScript" value="JavaScript" />
            <el-option label="Vue3" value="Vue3" />
            <el-option label="React" value="React" />
            <el-option label="TypeScript" value="TypeScript" />
            <el-option label="TailwindCSS" value="TailwindCSS" />
          </el-select>
          <el-select v-model="selectedDifficulty" placeholder="选择难度" class="difficulty-select">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </div>
      </div>

      <div class="exercise-content">
        <div v-if="loading" class="loading-state">
          <el-icon class="is-loading" style="font-size: 48px; color: #409eff; margin-bottom: 16px;">
            <Loading />
          </el-icon>
          <p style="font-size: 16px; color: #606266;">正在生成题目，请稍候...</p>
        </div>

        <div v-else-if="!question" class="loading-state">
          <el-empty description="点击下方按钮生成题目" />
          <el-button type="primary" size="large" @click="generateNewQuestion" class="mt-4">
            生成题目
          </el-button>
        </div>

        <div v-else class="question-card">
          <div class="question-header">
            <div class="question-title">
              <h3>{{ selectedCourse }} 编程题</h3>
              <el-tag :type="difficultyTagType()">{{ difficultyLabel() }}</el-tag>
            </div>
            <el-button text @click="generateNewQuestion" :loading="loading">
              下一题
            </el-button>
          </div>

          <div class="question-body">
            <div class="question-section">
              <h4>题目：</h4>
              <p class="question-text">{{ question.question }}</p>
            </div>

            <div class="code-section">
              <h4>代码框架（请填空）：</h4>
              <CodeHighlighter
                :code="question.skeleton_code || question.full_code"
                language="javascript"
              />
            </div>

            <div class="key-points-section">
              <h4>关键知识点：</h4>
              <div class="key-points">
                <el-tag v-for="point in question.key_points" :key="point">
                  {{ point }}
                </el-tag>
              </div>
            </div>

            <div class="answer-section">
              <h4>你的答案：</h4>
              <div v-for="(answer, index) in userAnswers" :key="index" class="answer-input-group">
                <span class="answer-label">答案 {{ index + 1 }}：</span>
                <el-input
                  v-model="userAnswers[index]"
                  type="textarea"
                  :rows="4"
                  :placeholder="`请输入答案 ${index + 1}`"
                  :disabled="submitted"
                />
              </div>
            </div>

            <div v-if="submitted" class="result-section" :class="{ correct: gradeResult?.score === 100 }">
              <div class="result-header">
                <span v-if="gradeResult?.score === 100" class="success">✓ 答案正确！</span>
                <span v-else class="error">✗ 答案错误 (得分：{{ gradeResult?.score || 0 }}分)</span>
              </div>
              <div class="feedback">{{ gradeResult?.feedback }}</div>
              <div class="explanation">
                <h5>答案解析：</h5>
                <p>{{ question.explanation }}</p>
              </div>
              <el-button
                v-if="(gradeResult?.score ?? 0) < 100"
                type="warning"
                size="small"
                :loading="savingWrong"
                @click="saveToWrongBook"
                style="margin-top: 12px;"
              >
                📌 加入错题本
              </el-button>
            </div>

            <div class="button-group">
              <el-button 
                v-if="!submitted"
                type="primary" 
                @click="submitAnswer"
                :loading="grading"
              >
                提交答案
              </el-button>
              <el-button v-else type="primary" @click="nextQuestion">
                下一题
              </el-button>
              <el-button @click="resetQuestion">
                重新作答
              </el-button>
              <el-button @click="goBack">
                返回学习
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import CodeHighlighter from '@/components/CodeHighlighter.vue'
import { generateQuestion as generateQuestionAPI, gradeAnswer, type ExerciseQuestion } from '@/api/exercise'
import { addWrongQuestion, getWrongQuestions, updateWrongQuestionNote } from '@/api/wrongQuestion'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const selectedCourse = ref(route.params.course as string || 'JavaScript')
const selectedDifficulty = ref('medium')
const question = ref<ExerciseQuestion | null>(null)
const userAnswers = ref<string[]>([])
const submitted = ref(false)
const loading = ref(false)
const grading = ref(false)
const gradeResult = ref<{ score: number; feedback: string } | null>(null)
const savingWrong = ref(false)

const difficultyTagType = () => {
  const map: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return map[selectedDifficulty.value] || 'info'
}

const difficultyLabel = () => {
  const map: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[selectedDifficulty.value] || '中等'
}

const parseCozeResponse = (data: any): ExerciseQuestion => {
  return {
    question: (data.question || '题目').replace(/\\n/g, '\n'),
    skeleton_code: data.code || '',
    full_code: data.full_code || '',
    explanation: data.explanation || '',
    answer: Array.isArray(data.answer) ? data.answer : [data.answer || ''],
    key_points: Array.isArray(data.key_points) ? data.key_points : []
  }
}

const formatCode = async (code: string): Promise<string> => {
  try {
    await loadPrettier()
    const prettier = (window as any).prettier
    const plugins = (window as any).prettierPlugins || {}

    // 判断代码类型
    let parser = 'babel'
    let pluginList = [plugins.babel, plugins.estree]

    if (code.includes('{') && code.includes('}') && !code.includes('function') && !code.includes('const') && !code.includes('let')) {
      // 可能是 CSS
      parser = 'css'
      pluginList = [plugins.postcss]
    } else if (code.includes('<') && code.includes('>')) {
      // 可能是 HTML
      parser = 'html'
      pluginList = [plugins.html]
    }

    const formatted = prettier.format(code, {
      parser,
      plugins: pluginList,
      semi: false,
      singleQuote: true,
      trailingComma: 'es5'
    })
    return formatted
  } catch (error) {
    console.warn('Code formatting failed:', error)
    return code
  }
}

const loadPrettier = async () => {
  const w = window as any
  if (w.prettier && w.prettierPlugins?.babel && w.prettierPlugins?.postcss && w.prettierPlugins?.html) return

  const loadScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  await loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/standalone.js')
  await Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/babel.js'),
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/estree.js'),
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/postcss.js'),
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/html.js')
  ])
  w.prettierPlugins = w.prettierPlugins || {}
  w.prettierPlugins.babel = w.prettierPlugins.babel || w.prettierPlugins[0]
  w.prettierPlugins.estree = w.prettierPlugins.estree || w.prettierPlugins[1]
  w.prettierPlugins.postcss = w.prettierPlugins.postcss || w.prettierPlugins[2]
  w.prettierPlugins.html = w.prettierPlugins.html || w.prettierPlugins[3]
}

const generateNewQuestion = async () => {
  loading.value = true
  try {
    const data = await generateQuestionAPI(selectedCourse.value, selectedDifficulty.value)
    const parsedData = parseCozeResponse(data)

    if (parsedData.full_code) {
      parsedData.full_code = await formatCode(parsedData.full_code)
    }
    question.value = parsedData

    // 根据答案数量初始化输入框
    userAnswers.value = new Array(parsedData.answer.length).fill('')
    resetQuestion()
  } catch (error) {
    ElMessage.error('题目生成失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const submitAnswer = async () => {
  if (!userAnswers.value.some(ans => ans.trim())) {
    ElMessage.warning('请至少输入一个答案')
    return
  }

  grading.value = true
  try {
    gradeResult.value = await gradeAnswer(
      question.value!.question,
      userAnswers.value.join('|'),
      question.value!.answer
    )
    submitted.value = true
  } catch (error) {
    ElMessage.error('批改失败，请重试')
  } finally {
    grading.value = false
  }
}

const nextQuestion = async () => {
  await generateNewQuestion()
}

const resetQuestion = () => {
  userAnswers.value = userAnswers.value.map(() => '')
  submitted.value = false
  gradeResult.value = null
}

const saveToWrongBook = async () => {
  if (!question.value || !userStore.userInfo?.userId) return
  savingWrong.value = true
  try {
    const wrongCode = JSON.stringify({
      question: question.value.question,
      skeletonCode: question.value.skeleton_code,
      fullCode: question.value.full_code,
      answer: question.value.answer,
      keyPoints: question.value.key_points
    })
    const note = `我的答案：${userAnswers.value.join(' | ')}\n得分：${gradeResult.value?.score || 0}分\n反馈：${gradeResult.value?.feedback || ''}`

    const res: any = await getWrongQuestions(userStore.userInfo.userId)
    const existing = (res?.data || []).find((item: any) => item.wrongCode === wrongCode)

    if (existing) {
      await updateWrongQuestionNote(existing.id, note + '\n\n--- 重复作答 ---\n' + new Date().toLocaleString())
      ElMessage.success('已更新错题记录')
    } else {
      await addWrongQuestion({
        courseKey: selectedCourse.value.toLowerCase(),
        lessonTitle: `${selectedCourse.value} - ${selectedDifficulty.value}难度`,
        wrongCode,
        note
      })
      ElMessage.success('已加入错题本')
    }
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '保存失败')
  }
  savingWrong.value = false
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.ai-exercise {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .ai-exercise {
  background: #1a1a1a;
}

.exercise-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.exercise-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .exercise-header {
  background: #2d2d2d;
}

.header-controls {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.course-select,
.difficulty-select {
  flex: 1;
  max-width: 200px;
}

.exercise-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .exercise-content {
  background: #2d2d2d;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.question-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .question-header {
  border-bottom: 1px solid #404040;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-section,
.code-section,
.key-points-section,
.answer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-section {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
}

.dark .question-section {
  background: #374151;
}

.question-text {
  margin: 0;
  line-height: 1.6;
  color: #374151;
}

.dark .question-text {
  color: #d1d5db;
}

.key-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-section {
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 16px;
}

.dark .result-section {
  background: #1f3a1f;
  border-color: #4ade80;
}

.result-header {
  font-weight: bold;
  margin-bottom: 8px;
}

.success {
  color: #16a34a;
}

.error {
  color: #dc2626;
}

.feedback {
  margin: 8px 0;
  color: #374151;
}

.dark .feedback {
  color: #d1d5db;
}

.explanation {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #d1d5db;
}

.dark .explanation {
  border-top: 1px solid #4b5563;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.mt-4 {
  margin-top: 16px;
}
</style>

