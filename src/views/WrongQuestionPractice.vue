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

          <div v-if="submitted" class="result-section" :class="resultClass">
            <div class="result-header">
              <span v-if="gradeResult?.score === 100" class="success">🎉 完美！答案全部正确 (100分)</span>
              <span v-else-if="(gradeResult?.score ?? 0) >= 70" class="partial">👍 做得不错！得分：{{ gradeResult?.score || 0 }}分</span>
              <span v-else-if="(gradeResult?.score ?? 0) > 0" class="warning">💪 继续努力！得分：{{ gradeResult?.score || 0 }}分</span>
              <span v-else class="error">❌ 需要再复习一下 (0分)</span>
            </div>
            <div class="feedback">{{ gradeResult?.feedback }}</div>
            <div v-if="originalNote" class="original-note">
              <h5>📝 上次作答记录：</h5>
              <div class="note-content" v-html="formatNote(originalNote)"></div>
            </div>

            <div v-if="gradeResult?.score === 100 && wrongQuestionId" class="success-actions">
              <p class="success-tip">🎊 恭喜你完全掌握了这道题！</p>
              <el-button type="success" size="small" @click="removeFromWrongBook" :loading="removing">
                ✨ 将该题从错题本中移除
              </el-button>
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
            <el-button v-if="submitted && (gradeResult?.score ?? 0) < 100" type="warning" @click="retryAnswer" :loading="grading">
              再试一次
            </el-button>
            <el-button v-if="submitted && (gradeResult?.score ?? 0) === 100" type="primary" @click="goBack">
              返回错题本
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Loading } from '@element-plus/icons-vue'
import CodeHighlighter from '@/components/CodeHighlighter.vue'
import { gradeAnswer } from '@/api/exercise'
import { getWrongQuestions, markAsMastered } from '@/api/wrongQuestion'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

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
const wrongQuestionId = ref<number | null>(null)
const removing = ref(false)

const difficultyTagType = ref('warning')
const difficultyLabel = ref('中等')

const resultClass = computed(() => {
  const score = gradeResult.value?.score ?? 0
  if (score === 100) return 'correct'
  if (score >= 70) return 'partial-correct'
  if (score > 0) return 'warning'
  return 'error'
})

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

      findWrongQuestionId(inner).then(() => {
        console.log('错题ID查找完成:', wrongQuestionId.value)
      })
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

async function findWrongQuestionId(questionInner: any) {
  if (!userStore.userInfo?.userId) return
  try {
    const res: any = await getWrongQuestions(userStore.userInfo.userId)
    const allQuestions = res?.data || []

    console.log('查找错题ID，总错题数:', allQuestions.length)
    console.log('当前题目question:', questionInner.question)

    for (const item of allQuestions) {
      try {
        if (!item.wrongCode) continue

        let itemData: any = {}
        if (typeof item.wrongCode === 'string') {
          itemData = JSON.parse(item.wrongCode)
        } else {
          itemData = item.wrongCode
        }

        if (itemData.question === questionInner.question ||
            (itemData.question && questionInner.question &&
             itemData.question.slice(0, 50) === questionInner.question.slice(0, 50))) {
          wrongQuestionId.value = item.id
          console.log('找到匹配的错题，ID:', item.id)
          return
        }
      } catch (e) {
        continue
      }
    }

    console.warn('未找到匹配的错题记录')
  } catch (e) {
    console.error('查找错题ID失败', e)
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

function retryAnswer() {
  submitted.value = false
  gradeResult.value = null
}

async function removeFromWrongBook() {
  if (!wrongQuestionId.value) {
    ElMessage.warning('未找到错题记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要将这道题从错题本中移除吗？\n移除后将保存到"已掌握历史"，可以随时回顾你的学习成果！',
      '确认移除',
      { type: 'success', confirmButtonText: '确认移除', cancelButtonText: '保留在错题本' }
    )
  } catch {
    return
  }

  removing.value = true
  try {
    await markAsMastered(wrongQuestionId.value)

    ElMessage.success('✨ 已从错题本移除并保存到已掌握历史！')
    wrongQuestionId.value = null
    setTimeout(() => {
      router.push('/mastered')
    }, 1500)
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '移除失败，请重试')
  } finally {
    removing.value = false
  }
}

function formatNote(note: string): string {
  return note
    .replace(/【作答记录.*?】/g, '<strong style="color: #3b82f6;">$&</strong>')
    .replace(/得分：(\d+)分/g, '<span style="color: #16a34a; font-weight: bold;">得分：$1分</span>')
    .replace(/答案 \d+：.*?✓/g, '<span style="color: #16a34a;">$&</span>')
    .replace(/答案 \d+：.*?✗/g, '<span style="color: #dc2626;">$&</span>')
    .replace(/(正确答案:[^)]*\))/g, '<em style="color: #6b7280; font-size: 0.9em;">$1</em>')
    .replace(/━━━━━━━━━━━━━━━━━━━━/g, '<hr style="border: none; border-top: 1px dashed #d1d5db; margin: 8px 0;">')
    .replace(/\n/g, '<br>')
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
  border-radius: 8px;
  padding: 18px;
  transition: all 0.3s ease;
}

.result-section.correct {
  background: #f0fdf4;
  border-color: #86efac;
}
.dark .result-section.correct {
  background: #1f3a1f;
  border-color: #4ade80;
}

.result-section.partial-correct {
  background: #fffbeb;
  border-color: #fcd34d;
}
.dark .result-section.partial-correct {
  background: #3f2f00;
  border-color: #fbbf24;
}

.result-section.warning {
  background: #fef3c7;
  border-color: #fca5a5;
}
.dark .result-section.warning {
  background: #3f2a00;
  border-color: #f59e0b;
}

.result-section.error {
  background: #fef2f2;
  border-color: #fca5a5;
}
.dark .result-section.error {
  background: #3f1f1f;
  border-color: #ef4444;
}

.result-header {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.success {
  color: #16a34a;
}

.partial {
  color: #d97706;
}

.warning {
  color: #f59e0b;
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
  border-top-color: #4b5563;
}

.original-note h5 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #9ca3af;
}

.note-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
  font-size: 13px;
  line-height: 1.8;
  color: #374151;
  white-space: normal;
  word-break: break-word;
}
.dark .note-content { 
  background: #1f2937; 
  border-color: #374151; 
  color: #d1d5db; 
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.success-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px dashed #86efac;
  text-align: center;
}
.dark .success-actions { border-top-color: #4ade80; }

.success-tip {
  font-size: 15px;
  font-weight: 600;
  color: #16a34a;
  margin: 0 0 12px 0;
}
.dark .success-tip { color: #4ade80; }
</style>
