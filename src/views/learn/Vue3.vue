<template>
  <div class="vue3-learn">
    <div class="learn-container">
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Vue3 框架学习
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
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                代码示例
              </h4>
              <CodeHighlighter :code="currentLesson.codeExample" language="vue" title="Vue 代码" />
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
const totalSteps = ref(6)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

const lessons = [
  {
    title: 'Vue3 简介和组合式API',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>什么是Vue3？</h4>
      <p>Vue3是Vue.js的最新版本，引入了组合式API（Composition API），提供了更好的TypeScript支持和性能优化。</p>
      
      <h4>组合式API vs 选项式API</h4>
      <p>组合式API是Vue3的新特性，提供了更灵活的逻辑复用和代码组织方式：</p>
      <ul>
        <li>更好的逻辑复用</li>
        <li>更好的TypeScript支持</li>
        <li>更清晰的代码组织</li>
        <li>更小的包体积</li>
      </ul>
      
      <h4>setup函数</h4>
      <p>setup是组合式API的入口点，在组件创建之前执行，用于定义响应式数据和方法。</p>
    `,
    codeExample: `<template>
  <div>
    <h1>{{ title }}</h1>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 响应式数据
const title = ref('Vue3 学习')
const count = ref(0)

// 方法
const increment = () => {
  count.value++
}
<\/script>`
  },
  {
    title: '响应式数据',
    difficulty: '入门',
    duration: '18分钟',
    content: `
      <h4>响应式系统</h4>
      <p>Vue3使用Proxy实现响应式系统，比Vue2的Object.defineProperty更强大。</p>
      
      <h4>ref和reactive</h4>
      <p>Vue3提供了两种创建响应式数据的方式：</p>
      <ul>
        <li><code>ref</code> - 用于基本类型和单个值</li>
        <li><code>reactive</code> - 用于对象和数组</li>
      </ul>
      
      <h4>computed计算属性</h4>
      <p>computed用于创建基于其他响应式数据的计算属性，具有缓存特性。</p>
      
      <h4>watch监听器</h4>
      <p>watch用于监听响应式数据的变化，执行副作用操作。</p>
    `,
    codeExample: `<template>
  <div>
    <input v-model="firstName" placeholder="名" />
    <input v-model="lastName" placeholder="姓" />
    <p>全名: {{ fullName }}</p>
    <p>名字长度: {{ nameLength }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const firstName = ref('')
const lastName = ref('')

// 计算属性
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})

const nameLength = computed(() => {
  return fullName.value.length
})

// 监听器
watch(fullName, (newValue, oldValue) => {
  console.log('全名从', oldValue, '变为', newValue)
})
<\/script>`
  },
  {
    title: '组件通信',
    difficulty: '初级',
    duration: '20分钟',
    content: `
      <h4>父子组件通信</h4>
      <p>Vue3提供了多种组件通信方式：</p>
      
      <h4>Props和Emits</h4>
      <ul>
        <li><code>props</code> - 父组件向子组件传递数据</li>
        <li><code>emits</code> - 子组件向父组件发送事件</li>
      </ul>
      
      <h4>Provide/Inject</h4>
      <p>用于跨层级组件通信，避免props逐层传递。</p>
      
      <h4>事件总线</h4>
      <p>使用mitt等库实现任意组件间的通信。</p>
    `,
    codeExample: `<!-- 父组件 -->
<template>
  <ChildComponent 
    :message="parentMessage" 
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const parentMessage = ref('来自父组件的消息')

const handleUpdate = (newMessage: string) => {
  parentMessage.value = newMessage
}
<\/script>

<!-- 子组件 -->
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="updateParent">更新父组件</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  message: string
}>()

const emit = defineEmits<{
  update: [message: string]
}>()

const updateParent = () => {
  emit('update', '子组件更新了消息')
}
<\/script>`
  },
  {
    title: '生命周期钩子',
    difficulty: '初级',
    duration: '16分钟',
    content: `
      <h4>生命周期概念</h4>
      <p>Vue组件从创建到销毁的整个过程称为生命周期，Vue3提供了相应的钩子函数。</p>
      
      <h4>主要生命周期钩子</h4>
      <ul>
        <li><code>onMounted</code> - 组件挂载后</li>
        <li><code>onUpdated</code> - 组件更新后</li>
        <li><code>onUnmounted</code> - 组件卸载前</li>
        <li><code>onBeforeMount</code> - 组件挂载前</li>
        <li><code>onBeforeUpdate</code> - 组件更新前</li>
        <li><code>onBeforeUnmount</code> - 组件卸载前</li>
      </ul>
      
      <h4>组合式API中的生命周期</h4>
      <p>在组合式API中，生命周期钩子需要从vue中导入。</p>
    `,
    codeExample: `<template>
  <div>
    <h1>{{ title }}</h1>
    <p>组件已挂载: {{ isMounted }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const title = ref('生命周期示例')
const isMounted = ref(false)

onMounted(() => {
  console.log('组件已挂载')
  isMounted.value = true
  
  // 设置定时器
  const timer = setInterval(() => {
    console.log('定时器执行')
  }, 1000)
  
  // 清理定时器
  onUnmounted(() => {
    clearInterval(timer)
    console.log('组件即将卸载，清理定时器')
  })
})
<\/script>`
  },
  {
    title: '路由和状态管理',
    difficulty: '中级',
    duration: '22分钟',
    content: `
      <h4>Vue Router</h4>
      <p>Vue Router是Vue.js的官方路由管理器，用于构建单页面应用。</p>
      
      <h4>基本路由配置</h4>
      <ul>
        <li>路由定义</li>
        <li>路由参数</li>
        <li>嵌套路由</li>
        <li>路由守卫</li>
      </ul>
      
      <h4>Pinia状态管理</h4>
      <p>Pinia是Vue3推荐的状态管理库，替代了Vuex：</p>
      <ul>
        <li>更简单的API</li>
        <li>更好的TypeScript支持</li>
        <li>模块化设计</li>
        <li>DevTools支持</li>
      </ul>
    `,
    codeExample: `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('@/views/About.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)
  
  const login = (userData) => {
    user.value = userData
    isLoggedIn.value = true
  }
  
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
  }
  
  return { user, isLoggedIn, login, logout }
})`
  },
  {
    title: '高级特性和最佳实践',
    difficulty: '中级',
    duration: '25分钟',
    content: `
      <h4>Teleport传送门</h4>
      <p>Teleport允许将组件渲染到DOM树的其他位置，常用于模态框、通知等。</p>
      
      <h4>Suspense异步组件</h4>
      <p>Suspense用于处理异步组件的加载状态，提供更好的用户体验。</p>
      
      <h4>自定义指令</h4>
      <p>Vue3允许创建自定义指令，用于DOM操作和复用逻辑。</p>
      
      <h4>组合式函数</h4>
      <p>组合式函数是Vue3中逻辑复用的主要方式，类似于React的Hooks。</p>
      
      <h4>性能优化</h4>
      <ul>
        <li>使用v-memo优化列表渲染</li>
        <li>合理使用shallowRef和shallowReactive</li>
        <li>组件懒加载</li>
        <li>Tree-shaking优化</li>
      </ul>
    `,
    codeExample: `<!-- Teleport示例 -->
<template>
  <div>
    <button @click="showModal = true">显示模态框</button>
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>模态框标题</h2>
          <p>这是模态框内容</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
<\/script>

<!-- 组合式函数示例 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 自定义组合式函数
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return { count, increment, decrement, reset }
}

// 使用组合式函数
const { count, increment, decrement, reset } = useCounter(10)
<\/script>`
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
    ElMessage.success('恭喜！Vue3学习完成！')
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
  persistProgress()
}

const goExercise = () => {
  router.push({ name: 'exercise', params: { course: 'vue3', step: currentStep.value } })
}

const goAIExercise = () => {
  router.push({
    name: 'ai-exercise',
    params: { course: 'Vue3' }
  })
}

onMounted(async () => {
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      const res = await getUserProgress(userStore.userInfo.userId)
      const s = res?.data?.vue3
      if (typeof s === 'number' && s >= 1 && s <= totalSteps.value) {
        currentStep.value = s
      }
    }
  } catch {}
})

async function persistProgress(){
  try {
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      await saveUserProgress({ userId: userStore.userInfo.userId, course: 'vue3', step: currentStep.value })
    }
  } catch {}
}
</script>

<style scoped>
.vue3-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .vue3-learn {
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

.code-example {
  margin: 24px 0;
}

.code-card {
  background: #1f2937;
  border: none;
}

.code-card pre {
  margin: 0;
  color: #f9fafb;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
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

:deep(.el-card__body) {
  padding: 16px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>

