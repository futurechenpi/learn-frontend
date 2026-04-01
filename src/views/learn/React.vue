<template>
  <div class="react-learn">
    <div class="learn-container">
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            React 框架学习
          </h2>
          <div class="progress-info">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              进度: {{ currentStep }}/{{ totalSteps }}
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
            </div>
          </div>

          <div class="content-body">
            <div class="lesson-content" v-html="currentLesson.content"></div>
            <div v-if="currentLesson.codeExample" class="code-example">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">代码示例</h4>
              <CodeHighlighter :code="currentLesson.codeExample" language="jsx" title="React 代码" />
              <div class="mt-3 flex gap-2">
                <el-button type="primary" @click="goExercise">开始练习</el-button>
                <el-button @click="goAIExercise">AI出题</el-button>
              </div>
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
              v-for="step in totalSteps"
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
            :disabled="currentStep === totalSteps"
            @click="nextLesson"
          >
            {{ currentStep === totalSteps ? '完成' : '下一课' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CodeHighlighter from '@/components/CodeHighlighter.vue'
import { useUserStore } from '@/stores/user'
import { getUserProgress, saveUserProgress } from '@/api/progress'

const router = useRouter()
const userStore = useUserStore()
const currentStep = ref(1)
const totalSteps = ref(4)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

const lessons = [
  {
    title: 'React 基础概念',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>什么是React？</h4>
      <p>React是由Facebook开发的用于构建用户界面的JavaScript库，采用组件化开发模式。</p>
      
      <h4>核心概念</h4>
      <ul>
        <li>组件 - 可复用的UI片段</li>
        <li>JSX - JavaScript XML语法</li>
        <li>虚拟DOM - 提高性能的DOM抽象</li>
        <li>单向数据流 - 数据从父组件流向子组件</li>
      </ul>
      
      <h4>Hooks</h4>
      <p>React Hooks让函数组件也能使用状态和生命周期特性：</p>
      <ul>
        <li>useState - 状态管理</li>
        <li>useEffect - 副作用处理</li>
        <li>useContext - 上下文共享</li>
        <li>useReducer - 复杂状态管理</li>
      </ul>
    `,
    codeExample: `import React from 'react'\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello React</h1>\n      <p>这是一个基础组件</p>\n    </div>\n  )\n}\n\nexport default App`
  },
  {
    title: '组件和状态管理',
    difficulty: '入门',
    duration: '18分钟',
    content: `
      <h4>函数组件</h4>
      <p>现代React主要使用函数组件，配合Hooks实现状态管理：</p>
      
      <h4>状态管理</h4>
      <ul>
        <li>useState - 本地状态</li>
        <li>useReducer - 复杂状态逻辑</li>
        <li>Context API - 跨组件状态共享</li>
        <li>Redux - 全局状态管理</li>
      </ul>
      
      <h4>组件通信</h4>
      <ul>
        <li>Props - 父传子</li>
        <li>回调函数 - 子传父</li>
        <li>Context - 跨层级通信</li>
        <li>状态提升 - 兄弟组件通信</li>
      </ul>
    `,
    codeExample: `import React, { useState } from 'react'\n\nfunction Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <div>\n      <p>计数: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  )\n}\n\nexport default Counter`
  },
  {
    title: '生命周期和副作用',
    difficulty: '初级',
    duration: '20分钟',
    content: `
      <h4>useEffect Hook</h4>
      <p>useEffect用于处理副作用，如数据获取、订阅、手动DOM操作等：</p>
      
      <h4>依赖数组</h4>
      <ul>
        <li>空数组 [] - 只在挂载和卸载时执行</li>
        <li>有依赖 - 依赖变化时执行</li>
        <li>无依赖 - 每次渲染都执行</li>
      </ul>
      
      <h4>清理函数</h4>
      <p>useEffect可以返回清理函数，用于清理副作用：</p>
      <ul>
        <li>取消网络请求</li>
        <li>清理定时器</li>
        <li>移除事件监听器</li>
      </ul>
    `,
    codeExample: `import React, { useEffect, useState } from 'react'\n\nfunction Timer() {\n  const [tick, setTick] = useState(0)\n  useEffect(() => {\n    const id = setInterval(() => setTick(t => t + 1), 1000)\n    return () => clearInterval(id)\n  }, [])\n  return <div>Tick: {tick}</div>\n}\n\nexport default Timer`
  },
  {
    title: '性能优化和最佳实践',
    difficulty: '中级',
    duration: '22分钟',
    content: `
      <h4>性能优化</h4>
      <ul>
        <li>React.memo - 组件记忆化</li>
        <li>useMemo - 值记忆化</li>
        <li>useCallback - 函数记忆化</li>
        <li>代码分割 - 懒加载组件</li>
      </ul>
      
      <h4>最佳实践</h4>
      <ul>
        <li>组件拆分 - 单一职责原则</li>
        <li>自定义Hooks - 逻辑复用</li>
        <li>错误边界 - 错误处理</li>
        <li>TypeScript - 类型安全</li>
      </ul>
      
      <h4>生态系统</h4>
      <ul>
        <li>React Router - 路由管理</li>
        <li>Redux Toolkit - 状态管理</li>
        <li>Ant Design - UI组件库</li>
        <li>Next.js - 全栈框架</li>
      </ul>
    `,
    codeExample: `import React, { memo, useMemo } from 'react'\n\nconst List = memo(({ items }) => {\n  const total = useMemo(() => items.reduce((a,b)=>a+b, 0), [items])\n  return (\n    <ul>\n      {items.map((it, i) => <li key={i}>{it}</li>)}\n      <li>总计: {total}</li>\n    </ul>\n  )\n})\n\nexport default List`
  }
]

const currentLesson = computed(() => {
  return lessons[currentStep.value - 1]
})

const previousLesson = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    persistProgress()
  }
}

const nextLesson = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
    persistProgress()
  } else {
    ElMessage.success('恭喜！React学习完成！')
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
  persistProgress()
}

const goExercise = () => {
  const lesson: any = currentLesson.value
  router.push({
    name: 'exercise',
    params: { course: 'react', step: currentStep.value },
    query: { code: lesson?.codeExample || '', lang: 'jsx' }
  })
}

const goAIExercise = () => {
  router.push({
    name: 'ai-exercise',
    params: { course: 'React' }
  })
}

onMounted(async () => {
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      const res = await getUserProgress(userStore.userInfo.userId)
      const s = res?.data?.react
      if (typeof s === 'number' && s >= 1 && s <= totalSteps.value) {
        currentStep.value = s
      }
    }
  } catch {}
})

async function persistProgress(){
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      await saveUserProgress({ userId: userStore.userInfo.userId, course: 'react', step: currentStep.value })
    }
  } catch {}
}
</script>

<style scoped>
.react-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .react-learn {
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
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .content-header {
  border-bottom: 1px solid #404040;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.lesson-content {
  line-height: 1.6;
  color: #374151;
}

.dark .lesson-content {
  color: #d1d5db;
}

.lesson-content h4 {
  color: #1f2937;
  margin: 16px 0 8px 0;
}

.dark .lesson-content h4 {
  color: #f9fafb;
}

.lesson-content ul {
  margin: 12px 0;
  padding-left: 24px;
}

.lesson-content li {
  margin: 8px 0;
}

.navigation-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .navigation-section {
  background: #2d2d2d;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-indicators {
  display: flex;
  gap: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>

