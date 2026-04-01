<template>
  <div class="exercise-container">
    <div class="exercise-card">
      <div v-if="!question" class="loading-state">
        <el-skeleton :rows="5" animated />
        <el-button type="primary" @click="loadQuestion" class="mt-4">
          {{ loading ? '加载中...' : '生成题目' }}
        </el-button>
      </div>

      <div v-else class="question-content">
        <div class="question-header">
          <h3>编程练习题</h3>
          <el-tag :type="difficultyType">{{ difficulty }}</el-tag>
        </div>

        <div class="question-body">
          <div class="question-text">
            <h4>题目：</h4>
            <p>{{ question.question }}</p>
          </div>

          <div class="code-section">
            <h4>完整代码参考：</h4>
            <CodeHighlighter 
              :code="question.full_code" 
              language="javascript"
            />
          </div>

          <div class="key-points">
            <h4>关键知识点：</h4>
            <el-tag v-for="point in question.key_points" :key="point" class="mr-2">
              {{ point }}
            </el-tag>
          </div>

          <div class="answer-section">
            <h4>你的答案：</h4>
            <el-input
              v-model="userAnswer"
              type="textarea"
              :rows="4"
              placeholder="请输入你的答案"
              :disabled="submitted"
            />
          </div>

          <div v-if="submitted" class="result-section" :class="{ correct: gradeResult?.score === 100 }">
            <div class="result-header">
              <span v-if="gradeResult?.score === 100" class="success">✓ 答案正确！</span>
              <span v-else class="error">✗ 答案错误</span>
            </div>
            <div class="feedback">{{ gradeResult?.feedback }}</div>
            <div class="explanation">
              <h5>答案解析：</h5>
              <p>{{ question.explanation }}</p>
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
            <el-button v-else @click="nextQuestion">
              下一题
            </el-button>
            <el-button @click="resetQuestion">
              重新作答
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CodeHighlighter from '@/components/CodeHighlighter.vue'
import { generateQuestion, gradeAnswer, type ExerciseQuestion } from '@/api/exercise'

interface Props {
  topic: string
  difficulty?: string
}

const props = withDefaults(defineProps<Props>(), {
  difficulty: 'medium'
})

const question = ref<ExerciseQuestion | null>(null)
const userAnswer = ref('')
const submitted = ref(false)
const loading = ref(false)
const grading = ref(false)
const gradeResult = ref<{ score: number; feedback: string } | null>(null)

const difficultyType = () => {
  const map: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return map[props.difficulty] || 'info'
}

const loadQuestion = async () => {
  loading.value = true
  try {
    question.value = await generateQuestion(props.topic, props.difficulty)
  } catch (error) {
    ElMessage.error('题目生成失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const submitAnswer = async () => {
  if (!userAnswer.value.trim()) {
    ElMessage.warning('请输入答案')
    return
  }

  grading.value = true
  try {
    gradeResult.value = await gradeAnswer(
      question.value!.question,
      userAnswer.value,
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
  resetQuestion()
  await loadQuestion()
}

const resetQuestion = () => {
  userAnswer.value = ''
  submitted.value = false
  gradeResult.value = null
}

// 组件挂载时加载题目
import { onMounted } from 'vue'
onMounted(() => {
  loadQuestion()
})
</script>

<style scoped>
.exercise-container {
  padding: 20px;
}

.exercise-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .exercise-card {
  background: #2d2d2d;
}

.loading-state {
  text-align: center;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .question-header {
  border-bottom: 1px solid #404040;
}

.question-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-text {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
}

.dark .question-text {
  background: #374151;
}

.code-section {
  margin: 16px 0;
}

.key-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.answer-section {
  margin: 16px 0;
}

.result-section {
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.result-section.correct {
  background: #f0fdf4;
  border-color: #86efac;
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
}

.mr-2 {
  margin-right: 8px;
}

.mt-4 {
  margin-top: 16px;
}
</style>

