<template>
  <div class="css-learn">
    <div class="learn-container">
      <!-- 学习进度 -->
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            CSS 样式学习
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

      <!-- 学习内容 -->
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
            
            <!-- 代码示例 -->
            <div v-if="currentLesson.codeExample" class="code-example">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                代码示例
              </h4>
              <el-card class="code-card">
                <pre><code class="css">{{ currentLesson.codeExample }}</code></pre>
              </el-card>
            </div>

            <!-- 效果预览 -->
            <div v-if="currentLesson.preview" class="preview-section">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                效果预览
              </h4>
              <div class="preview-content" v-html="currentLesson.preview"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
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
import { ElMessage } from 'element-plus'

const currentStep = ref(1)
const totalSteps = ref(4)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

const lessons = [
  {
    title: 'CSS 基础语法',
    difficulty: '入门',
    duration: '12分钟',
    content: `
      <h4>什么是CSS？</h4>
      <p>CSS（Cascading Style Sheets）用于控制网页的样式和布局，让网页更美观。</p>
      
      <h4>CSS语法</h4>
      <p>CSS规则由选择器、属性和值组成：</p>
      <ul>
        <li>选择器：选择要样式化的HTML元素</li>
        <li>属性：要改变的样式属性</li>
        <li>值：属性的具体值</li>
      </ul>
    `,
    codeExample: `/* 选择器 { 属性: 值; } */
h1 {
    color: blue;
    font-size: 24px;
}

p {
    color: #333;
    line-height: 1.6;
}`,
    preview: `
      <div style="color: blue; font-size: 24px; font-weight: bold;">这是标题样式</div>
      <p style="color: #333; line-height: 1.6;">这是段落样式，行高为1.6倍。</p>
    `
  },
  {
    title: '选择器详解',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>基本选择器</h4>
      <ul>
        <li>元素选择器：<code>p</code> - 选择所有p标签</li>
        <li>类选择器：<code>.class</code> - 选择class为"class"的元素</li>
        <li>ID选择器：<code>#id</code> - 选择id为"id"的元素</li>
      </ul>
      
      <h4>组合选择器</h4>
      <ul>
        <li>后代选择器：<code>div p</code> - 选择div内的所有p</li>
        <li>子选择器：<code>div > p</code> - 选择div的直接子元素p</li>
        <li>相邻选择器：<code>h1 + p</code> - 选择h1后面的第一个p</li>
      </ul>
    `,
    codeExample: `/* 元素选择器 */
h1 { color: red; }

/* 类选择器 */
.highlight { background: yellow; }

/* ID选择器 */
#header { font-size: 32px; }

/* 后代选择器 */
div p { margin: 10px; }

/* 子选择器 */
div > p { padding: 5px; }`,
    preview: `
      <h1 style="color: red;">标题（红色）</h1>
      <p class="highlight" style="background: yellow; padding: 5px;">高亮段落</p>
      <div style="border: 1px solid #ccc; padding: 10px;">
        <p style="margin: 10px;">div内的段落</p>
      </div>
    `
  },
  {
    title: '盒模型和布局',
    difficulty: '初级',
    duration: '18分钟',
    content: `
      <h4>盒模型</h4>
      <p>每个HTML元素都是一个盒子，包含：</p>
      <ul>
        <li>内容（content）</li>
        <li>内边距（padding）</li>
        <li>边框（border）</li>
        <li>外边距（margin）</li>
      </ul>
      
      <h4>常用布局属性</h4>
      <ul>
        <li><code>display</code> - 显示方式</li>
        <li><code>position</code> - 定位方式</li>
        <li><code>float</code> - 浮动</li>
        <li><code>flex</code> - 弹性布局</li>
      </ul>
    `,
    codeExample: `.box {
    width: 200px;
    height: 100px;
    padding: 20px;
    border: 2px solid #333;
    margin: 10px;
    background: #f0f0f0;
}

.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}`,
    preview: `
      <div style="width: 200px; height: 100px; padding: 20px; border: 2px solid #333; margin: 10px; background: #f0f0f0; display: inline-block;">
        盒模型示例
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; background: #e0e0e0; padding: 10px; margin-top: 20px;">
        <div style="background: #ff6b6b; padding: 10px;">项目1</div>
        <div style="background: #4ecdc4; padding: 10px;">项目2</div>
        <div style="background: #45b7d1; padding: 10px;">项目3</div>
      </div>
    `
  },
  {
    title: '响应式设计',
    difficulty: '初级',
    duration: '20分钟',
    content: `
      <h4>媒体查询</h4>
      <p>使用媒体查询让网页在不同设备上都有良好的显示效果：</p>
      
      <h4>常用断点</h4>
      <ul>
        <li>手机：< 768px</li>
        <li>平板：768px - 1024px</li>
        <li>桌面：> 1024px</li>
      </ul>
      
      <h4>弹性单位</h4>
      <ul>
        <li><code>rem</code> - 相对于根元素字体大小</li>
        <li><code>em</code> - 相对于当前元素字体大小</li>
        <li><code>%</code> - 相对于父元素</li>
        <li><code>vw/vh</code> - 相对于视口宽度/高度</li>
      </ul>
    `,
    codeExample: `/* 移动端优先 */
.container {
    width: 100%;
    padding: 10px;
}

/* 平板 */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}

/* 桌面 */
@media (min-width: 1024px) {
    .container {
        width: 1200px;
        padding: 20px;
    }
}`,
    preview: `
      <div style="width: 100%; padding: 10px; background: #f0f0f0; border: 1px solid #ccc;">
        <p>响应式容器 - 在不同屏幕尺寸下会调整宽度</p>
      </div>
    `
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
    ElMessage.success('恭喜！CSS基础学习完成！')
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
}
</script>

<style scoped>
.css-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .css-learn {
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

.preview-section {
  margin: 24px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.dark .preview-section {
  background: #374151;
  border-color: #404040;
}

.preview-content {
  background: white;
  padding: 20px;
  border-radius: 4px;
  min-height: 100px;
}

.dark .preview-content {
  background: #1f2937;
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

