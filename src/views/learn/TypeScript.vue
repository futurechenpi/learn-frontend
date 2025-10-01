<template>
  <div class="ts-learn">
    <div class="learn-container">
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            TypeScript 学习
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
              <CodeHighlighter :code="currentLesson.codeExample" language="typescript" title="TypeScript 代码" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CodeHighlighter from '@/components/CodeHighlighter.vue'

const router = useRouter()
const currentStep = ref(1)
const totalSteps = ref(4)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

const lessons = [
  {
    title: 'TypeScript 基础类型',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>什么是TypeScript？</h4>
      <p>TypeScript是JavaScript的超集，添加了静态类型检查，让代码更安全、更易维护。</p>
      
      <h4>基本类型</h4>
      <ul>
        <li>number - 数字类型</li>
        <li>string - 字符串类型</li>
        <li>boolean - 布尔类型</li>
        <li>array - 数组类型</li>
        <li>object - 对象类型</li>
        <li>null/undefined - 空值类型</li>
      </ul>
      
      <h4>类型注解</h4>
      <p>TypeScript使用类型注解来指定变量的类型：</p>
      <ul>
        <li>显式类型注解：<code>let name: string = "张三"</code></li>
        <li>类型推断：<code>let age = 25</code> (自动推断为number)</li>
      </ul>
    `,
    codeExample: `let name: string = '张三'\nlet age: number = 25\nlet isActive: boolean = true\nlet scores: number[] = [90, 85, 78]\n\nfunction greet(person: string): string {\n  return 'Hello ' + person\n}`
  },
  {
    title: '接口和类型别名',
    difficulty: '入门',
    duration: '18分钟',
    content: `
      <h4>接口 (Interface)</h4>
      <p>接口用于定义对象的形状，确保对象具有特定的结构：</p>
      
      <h4>类型别名 (Type Alias)</h4>
      <p>类型别名用于创建自定义类型，可以用于基本类型、联合类型等：</p>
      
      <h4>可选属性和只读属性</h4>
      <ul>
        <li>可选属性：<code>name?: string</code></li>
        <li>只读属性：<code>readonly id: number</code></li>
        <li>联合类型：<code>string | number</code></li>
        <li>交叉类型：<code>Type1 & Type2</code></li>
      </ul>
    `,
    codeExample: `interface User {\n  readonly id: number\n  name: string\n  email?: string\n}\n\ntype Result = 'success' | 'error'\n\nconst user: User = { id: 1, name: '张三' }`
  },
  {
    title: '泛型和高级类型',
    difficulty: '初级',
    duration: '20分钟',
    content: `
      <h4>泛型 (Generics)</h4>
      <p>泛型允许创建可重用的组件，这些组件可以处理多种类型：</p>
      
      <h4>泛型函数</h4>
      <p>泛型函数可以处理不同类型的参数，同时保持类型安全：</p>
      
      <h4>泛型接口</h4>
      <p>接口也可以使用泛型，提供更灵活的类型定义：</p>
      
      <h4>高级类型</h4>
      <ul>
        <li>Partial - 所有属性变为可选</li>
        <li>Required - 所有属性变为必需</li>
        <li>Pick - 选择特定属性</li>
        <li>Omit - 排除特定属性</li>
      </ul>
    `,
    codeExample: `function identity<T>(arg: T): T {\n  return arg\n}\n\ninterface Box<T> { value: T }\nconst box: Box<number> = { value: 123 }\n\ntype PartialUser = Partial<{ id: number; name: string }>`
  },
  {
    title: '在Vue3中使用TypeScript',
    difficulty: '中级',
    duration: '22分钟',
    content: `
      <h4>Vue3 + TypeScript</h4>
      <p>Vue3对TypeScript有很好的支持，提供了完整的类型定义：</p>
      
      <h4>组件类型定义</h4>
      <ul>
        <li>Props类型定义</li>
        <li>Emits类型定义</li>
        <li>组件实例类型</li>
        <li>组合式API类型</li>
      </ul>
      
      <h4>最佳实践</h4>
      <ul>
        <li>使用defineProps和defineEmits</li>
        <li>合理使用类型断言</li>
        <li>利用类型推断</li>
        <li>编写类型声明文件</li>
      </ul>
      
      <h4>工具和配置</h4>
      <ul>
        <li>tsconfig.json配置</li>
        <li>ESLint TypeScript规则</li>
        <li>Vite TypeScript支持</li>
        <li>类型检查工具</li>
      </ul>
    `,
    codeExample: `// 组件 props 类型示例\ninterface Props {\n  title: string\n  count?: number\n}\n\n// 组合式 API 类型\nimport { Ref } from 'vue'\nconst count: Ref<number> = ref(0)`
  }
]

const currentLesson = computed(() => {
  return lessons[currentStep.value - 1]
})

const previousLesson = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextLesson = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  } else {
    ElMessage.success('恭喜！TypeScript学习完成！')
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
}

const goExercise = () => {
  const lesson: any = currentLesson.value
  router.push({ 
    name: 'exercise', 
    params: { course: 'typescript', step: currentStep.value },
    query: { code: lesson?.codeExample || '', lang: 'typescript' }
  })
}
</script>

<style scoped>
.ts-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .ts-learn {
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

.lesson-content code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.dark .lesson-content code {
  background: #374151;
  color: #f9fafb;
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

