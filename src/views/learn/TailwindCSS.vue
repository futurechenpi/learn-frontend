<template>
  <div class="tailwind-learn">
    <div class="learn-container">
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            TailwindCSS 学习
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
              <CodeHighlighter :code="currentLesson.codeExample" language="html" title="Tailwind 示例" />
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
    title: 'TailwindCSS 基础概念',
    difficulty: '入门',
    duration: '12分钟',
    content: `
      <h4>什么是TailwindCSS？</h4>
      <p>TailwindCSS是一个实用优先的CSS框架，通过组合预定义的类来快速构建用户界面。</p>
      
      <h4>核心特点</h4>
      <ul>
        <li>实用优先 - 使用预定义的类</li>
        <li>响应式设计 - 内置断点系统</li>
        <li>可定制 - 通过配置文件自定义</li>
        <li>性能优化 - 只包含使用的样式</li>
      </ul>
      
      <h4>基本使用</h4>
      <p>直接在HTML元素上添加Tailwind类：</p>
      <ul>
        <li>颜色：<code>text-blue-500</code>, <code>bg-red-100</code></li>
        <li>间距：<code>p-4</code>, <code>m-2</code>, <code>px-6</code></li>
        <li>尺寸：<code>w-full</code>, <code>h-screen</code></li>
        <li>布局：<code>flex</code>, <code>grid</code>, <code>block</code></li>
      </ul>
    `,
    codeExample: `<div class="p-4 bg-blue-100 rounded">
  <h2 class="text-blue-600 font-bold">Hello Tailwind</h2>
  <p class="text-gray-600 mt-2">这是一个使用 Tailwind 类的示例。</p>
</div>`
  },
  {
    title: '布局和间距',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>Flexbox布局</h4>
      <p>TailwindCSS提供了丰富的Flexbox工具类：</p>
      <ul>
        <li><code>flex</code> - 设置为flex容器</li>
        <li><code>flex-row</code> - 水平排列</li>
        <li><code>flex-col</code> - 垂直排列</li>
        <li><code>justify-center</code> - 主轴居中</li>
        <li><code>items-center</code> - 交叉轴居中</li>
      </ul>
      
      <h4>Grid布局</h4>
      <p>CSS Grid布局工具类：</p>
      <ul>
        <li><code>grid</code> - 设置为grid容器</li>
        <li><code>grid-cols-3</code> - 3列网格</li>
        <li><code>gap-4</code> - 网格间距</li>
        <li><code>col-span-2</code> - 跨越2列</li>
      </ul>
      
      <h4>间距系统</h4>
      <p>Tailwind使用4px为基准的间距系统：</p>
      <ul>
        <li>内边距：<code>p-1</code> (4px) 到 <code>p-96</code> (384px)</li>
        <li>外边距：<code>m-1</code> 到 <code>m-96</code></li>
        <li>特定方向：<code>pt-4</code>, <code>px-6</code>, <code>my-8</code></li>
      </ul>
    `,
    codeExample: `<div class="flex justify-between items-center p-4 bg-gray-100">
  <div class="p-2 bg-red-300">1</div>
  <div class="p-2 bg-green-300">2</div>
  <div class="p-2 bg-blue-300">3</div>
</div>
<div class="grid grid-cols-3 gap-4 mt-4">
  <div class="col-span-2 bg-purple-200 p-4">A</div>
  <div class="bg-yellow-200 p-4">B</div>
</div>`
  },
  {
    title: '响应式设计和状态',
    difficulty: '初级',
    duration: '18分钟',
    content: `
      <h4>响应式断点</h4>
      <p>TailwindCSS内置了5个断点：</p>
      <ul>
        <li><code>sm:</code> - 640px及以上</li>
        <li><code>md:</code> - 768px及以上</li>
        <li><code>lg:</code> - 1024px及以上</li>
        <li><code>xl:</code> - 1280px及以上</li>
        <li><code>2xl:</code> - 1536px及以上</li>
      </ul>
      
      <h4>状态变体</h4>
      <p>支持各种状态和伪类：</p>
      <ul>
        <li><code>hover:</code> - 悬停状态</li>
        <li><code>focus:</code> - 焦点状态</li>
        <li><code>active:</code> - 激活状态</li>
        <li><code>disabled:</code> - 禁用状态</li>
        <li><code>dark:</code> - 暗色模式</li>
      </ul>
      
      <h4>组合使用</h4>
      <p>可以组合多个修饰符：</p>
      <ul>
        <li><code>md:hover:bg-blue-500</code> - 中等屏幕悬停时蓝色背景</li>
        <li><code>lg:focus:ring-2</code> - 大屏幕焦点时显示环形</li>
        <li><code>dark:sm:text-white</code> - 暗色模式小屏幕白色文字</li>
      </ul>
    `,
    codeExample: `<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 md:px-6">按钮</button>
<p class="text-gray-700 dark:sm:text-white mt-2">根据状态与断点改变样式</p>`
  },
  {
    title: '自定义和最佳实践',
    difficulty: '中级',
    duration: '20分钟',
    content: `
      <h4>配置文件</h4>
      <p>通过tailwind.config.js自定义主题：</p>
      <ul>
        <li>自定义颜色</li>
        <li>自定义字体</li>
        <li>自定义间距</li>
        <li>自定义断点</li>
      </ul>
      
      <h4>组件提取</h4>
      <p>将重复的类组合提取为组件：</p>
      <ul>
        <li>使用@apply指令</li>
        <li>创建可复用的CSS类</li>
        <li>保持HTML的简洁性</li>
      </ul>
      
      <h4>最佳实践</h4>
      <ul>
        <li>优先使用实用类</li>
        <li>合理使用响应式设计</li>
        <li>保持一致性</li>
        <li>使用IDE插件提高效率</li>
        <li>定期清理未使用的样式</li>
      </ul>
      
      <h4>与框架集成</h4>
      <ul>
        <li>Vue3 + TailwindCSS</li>
        <li>React + TailwindCSS</li>
        <li>Next.js + TailwindCSS</li>
        <li>Nuxt.js + TailwindCSS</li>
      </ul>
    `,
    codeExample: `/* tailwind.css */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* 组件提取 */\n.btn { @apply px-4 py-2 rounded font-medium bg-blue-500 text-white hover:bg-blue-600; }`
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
    ElMessage.success('恭喜！TailwindCSS学习完成！')
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
    params: { course: 'tailwindcss', step: currentStep.value },
    query: { code: lesson?.codeExample || '', lang: 'html' }
  })
}

onMounted(async () => {
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      const res = await getUserProgress(userStore.userInfo.userId)
      const s = res?.data?.tailwindcss
      if (typeof s === 'number' && s >= 1 && s <= totalSteps.value) {
        currentStep.value = s
      }
    }
  } catch {}
})

async function persistProgress(){
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      await saveUserProgress({ userId: userStore.userInfo.userId, course: 'tailwindcss', step: currentStep.value })
    }
  } catch {}
}
</script>

<style scoped>
.tailwind-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .tailwind-learn {
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

