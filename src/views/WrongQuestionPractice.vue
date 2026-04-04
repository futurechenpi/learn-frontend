<template>
  <div class="wq-practice">
    <div class="practice-container">
      <div class="practice-header">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon> 返回错题本
        </el-button>
        <h2>📝 错题重做</h2>
        <el-tag :type="difficultyTagType">{{ difficultyLabel }}</el-tag>
      </div>

      <div v-if="!loaded" class="loading-state">
        <el-icon class="is-loading" style="font-size: 40px; color: #409eff;">
          <Loading />
        </el-icon>
        <p>加载题目中...</p>
      </div>

      <div v-else-if="!questionData" class="error-state">
        <el-empty description="未找到错题数据">
          <el-button type="primary" @click="$router.push('/wrong-questions')">返回错题本</el-button>
        </el-empty>
      </div>

      <div v-else class="question-card">
        <div class="question-body">
          <div class="question-section">
            <h4>📋 题目：</h4>
            <p class="question-text">{{ questionData.question }}</p>
          </div>

          <div class="code-section">
            <h4>💻 代码框架（请填空）：</h4>
            <CodeHighlighter
              :code="questionData.skeletonCode || questionData.fullCode"
              language="javascript"
            />
          </div>

          <div class="key-points-section">
            <h4>🔑 关键知识点：</h4>
            <div class="key-points">
              <el-tag v-for="point in questionData.keyPoints" :key="point">
                {{ point }}
              </el-tag>
            </div>
          </div>

          <div class="answer-section">
            <h4>✏️ 你的答案：</h4>
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
            <div v-if="originalNote" class="original-note">
              <h5>上次作答记录：</h5>
              <pre>{{ originalNote }}</pre>
            </div>
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
            <el-button v-if="!submitted" @click="resetAnswers">
              重置答案
            </el-button>
            <el-button v-if="submitted && (gradeResult?.score ?? 0) < 100" type="warning" @click="submitAnswer" :loading="grading">
              再试一次
            </el-button>
            <el-button @click="goBack">
              返回错题本
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Loading } from '@element-plus/icons-vue'
import CodeHighlighter from '@/components/CodeHighlighter.vue'
import { gradeAnswer } from '@/api/exercise'

const router = useRouter()
const route = useRoute()

interface QuestionData {
  question: string
  skeletonCode: string
  fullCode: string
  answer: string[]
  keyPoints: string[]
}

const loaded = ref(false)
const questionData = ref<QuestionData | null>(null)
const originalNote = ref('')
const userAnswers = ref<string[]>([])
const submitted = ref(false)
const grading = ref(false)
const gradeResult = ref<{ score: number; feedback: string } | null>(null)

const difficultyTagType = ref('warning')
const difficultyLabel = ref('中等')

onMounted(() => {
  loadQuestionData()
})

function loadQuestionData() {
  const raw = route.query.data as string
  if (raw) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(raw)))
      const inner = typeof decoded.wrongCode === 'string' ? JSON.parse(decoded.wrongCode) : decoded
      questionData.value = {
        question: inner.question || '',
        skeletonCode: inner.skeletonCode || '',
        fullCode: inner.fullCode || '',
        answer: Array.isArray(inner.answer) ? inner.answer : [inner.answer || ''],
        keyPoints: Array.isArray(inner.keyPoints) ? inner.keyPoints : []
      }
      originalNote.value = decoded.note || ''
      userAnswers.value = new Array(questionData.value.answer.length).fill('')

      if (decoded.lessonTitle) {
        const title = decoded.lessonTitle
        if (title.includes('简单')) { difficultyTagType.value = 'success'; difficultyLabel.value = '简单' }
        else if (title.includes('困难')) { difficultyTagType.value = 'danger'; difficultyLabel.value = '困难' }
      }

      loaded.value = true
    } catch (e) {
      console.error('解析错题数据失败', e)
      questionData.value = null
      loaded.value = true
    }
  } else {
    loaded.value = true
    questionData.value = null
  }
}

async function submitAnswer() {
  if (!userAnswers.value.some(ans => ans.trim())) {
    ElMessage.warning('请至少输入一个答案')
    return
  }

  grading.value = true
  try {
    gradeResult.value = await gradeAnswer(
      questionData.value!.question,
      userAnswers.value.join('|'),
      questionData.value!.answer
    )
    submitted.value = true

    if (gradeResult.value.score === 100) {
      ElMessage.success('恭喜你，答对了！')
    }
  } catch (error) {
    ElMessage.error('批改失败，请重试')
  } finally {
    grading.value = false
  }
}

function resetAnswers() {
  userAnswers.value = userAnswers.value.map(() => '')
  submitted.value = false
  gradeResult.value = null
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.wq-practice {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .wq-practice {
  background: #1a1a1a;
}

.practice-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.practice-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.practice-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1f2937;
  flex: 1;
}

.dark .practive-header h2 {
  color: #e5e7eb;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.question-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dark .question-card {
  background: #2d2d2d;
}

.question-body {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.question-section,
.code-section,
.key-points-section,
.answer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-section h4,
.code-section h4,
.key-points-section h4,
.answer-section h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.dark .question-section h4,
.dark .code-section h4,
.dark .key-points-section h4,
.dark .answer-section h4 {
  color: #d1d5db;
}

.question-section {
  background: #f9fafb;
  padding: 18px;
  border-radius: 8px;
}

.dark .question-section {
  background: #374151;
}

.question-text {
  margin: 0;
  line-height: 1.7;
  color: #374151;
  font-size: 15px;
}

.dark .question-text {
  color: #d1d5db;
}

.key-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.answer-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.result-section {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 18px;
}

.dark .result-section {
  background: #3f1f1f;
  border-color: #ef4444;
}

.result-section.correct {
  background: #f0fdf4;
  border-color: #86efac;
}

.dark .result-section.correct {
  background: #1f3a1f;
  border-color: #4ade80;
}

.result-header {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.success {
  color: #16a34a;
}

.error {
  color: #dc2626;
}

.feedback {
  margin: 0 0 12px 0;
  color: #374151;
  line-height: 1.6;
}

.dark .feedback {
  color: #d1d5db;
}

.original-note {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #e5e7eb;
}

.dark .original-note {
  border-top: 1px solid #4b5563;
}

.original-note h5 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #9ca3af;
}

.original-note pre {
  margin: 0;
  padding: 12px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
</style>
