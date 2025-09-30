<template>
  <div class="html-learn">
    <div class="learn-container">
      <!-- 学习进度 -->
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            HTML 基础学习
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
              <CodeHighlighter 
                :code="currentLesson.codeExample" 
                language="html"
                title="HTML 代码"
              />
            </div>

            <!-- 实践练习 -->
            <div v-if="currentLesson.exercise" class="exercise-section">
              <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                实践练习
              </h4>
              <div class="exercise-content">
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  {{ currentLesson.exercise.description }}
                </p>
                <div class="exercise-actions">
                  <el-button type="primary" @click="openExercise">
                    开始练习
                  </el-button>
                  <el-button @click="showHint">
                    查看提示
                  </el-button>
                </div>
              </div>
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

      <!-- AI 助手
      <div class="ai-assistant">
        <el-card class="ai-card">
          <template #header>
            <div class="ai-header">
              <el-icon class="ai-icon"><ChatDotRound /></el-icon>
              <span>AI 学习助手</span>
            </div>
          </template>
          <div class="ai-content">
            <p class="ai-suggestion">
              {{ currentLesson.aiSuggestion }}
            </p>
            <el-button type="primary" size="small" @click="askAI">
              向AI提问
            </el-button>
          </div>
        </el-card>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons-vue'
import CodeHighlighter from '@/components/CodeHighlighter.vue'

const currentStep = ref(1)
const totalSteps = ref(5)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

const lessons = [
  {
    title: 'HTML 简介和基础结构',
    difficulty: '入门',
    duration: '10分钟',
    content: `
      <h4>什么是HTML？</h4>
      <p>HTML（HyperText Markup Language）是用于创建网页的标准标记语言。它使用标记标签来描述网页的结构和内容。</p>
      
      <h4>HTML文档结构</h4>
      <p>每个HTML文档都包含以下基本结构：</p>
      <ul>
        <li><code>&lt;!DOCTYPE html&gt;</code> - 文档类型声明</li>
        <li><code>&lt;html&gt;</code> - 根元素</li>
        <li><code>&lt;head&gt;</code> - 头部信息</li>
        <li><code>&lt;body&gt;</code> - 页面内容</li>
      </ul>
    `,
    codeExample: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
</head>
<body>
    <h1>欢迎来到我的网站！</h1>
    <p>这是我的第一个HTML页面。</p>
</body>
</html>`,
    exercise: {
      description: '创建一个简单的HTML页面，包含标题和段落。'
    },
    aiSuggestion: 'HTML是网页的基础，建议先理解文档结构，然后学习常用标签。'
  },
  {
    title: '常用HTML标签',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>标题标签</h4>
      <p>HTML提供了6个级别的标题标签：<code>&lt;h1&gt;</code> 到 <code>&lt;h6&gt;</code></p>
      
      <h4>文本标签</h4>
      <ul>
        <li><code>&lt;p&gt;</code> - 段落</li>
        <li><code>&lt;strong&gt;</code> - 粗体文本</li>
        <li><code>&lt;em&gt;</code> - 斜体文本</li>
        <li><code>&lt;br&gt;</code> - 换行</li>
      </ul>
      
      <h4>链接和图片</h4>
      <ul>
        <li><code>&lt;a&gt;</code> - 链接</li>
        <li><code>&lt;img&gt;</code> - 图片</li>
      </ul>
    `,
    codeExample: `<h1>主标题</h1>
<h2>副标题</h2>
<p>这是一个<strong>重要</strong>的段落，包含<em>斜体</em>文本。</p>
<a href="https://www.example.com">访问示例网站</a>
<img src="image.jpg" alt="示例图片">`,
    exercise: {
      description: '使用不同的HTML标签创建一个包含标题、段落、链接和图片的页面。'
    },
    aiSuggestion: '记住标签的语义化使用，选择合适的标签来表达内容的含义。'
  },
  {
    title: '列表和表格',
    difficulty: '入门',
    duration: '12分钟',
    content: `
      <h4>列表</h4>
      <p>HTML支持两种主要类型的列表：</p>
      <ul>
        <li><code>&lt;ul&gt;</code> - 无序列表</li>
        <li><code>&lt;ol&gt;</code> - 有序列表</li>
        <li><code>&lt;li&gt;</code> - 列表项</li>
      </ul>
      
      <h4>表格</h4>
      <p>表格用于显示结构化数据：</p>
      <ul>
        <li><code>&lt;table&gt;</code> - 表格</li>
        <li><code>&lt;tr&gt;</code> - 表格行</li>
        <li><code>&lt;td&gt;</code> - 表格单元格</li>
        <li><code>&lt;th&gt;</code> - 表格标题单元格</li>
      </ul>
    `,
    codeExample: `<!-- 无序列表 -->
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
</ul>

<!-- 有序列表 -->
<ol>
    <li>第一步</li>
    <li>第二步</li>
    <li>第三步</li>
</ol>

<!-- 表格 -->
<table>
    <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>城市</th>
    </tr>
    <tr>
        <td>张三</td>
        <td>25</td>
        <td>北京</td>
    </tr>
</table>`,
    exercise: {
      description: '创建一个包含列表和表格的页面，展示你的个人信息。'
    },
    aiSuggestion: '表格要使用语义化的标签，表头用th，数据用td，这样更利于屏幕阅读器理解。'
  },
  {
    title: '表单元素',
    difficulty: '初级',
    duration: '18分钟',
    content: `
      <h4>表单基础</h4>
      <p>表单用于收集用户输入：</p>
      <ul>
        <li><code>&lt;form&gt;</code> - 表单容器</li>
        <li><code>&lt;input&gt;</code> - 输入框</li>
        <li><code>&lt;textarea&gt;</code> - 文本域</li>
        <li><code>&lt;select&gt;</code> - 下拉选择</li>
        <li><code>&lt;button&gt;</code> - 按钮</li>
      </ul>
      
      <h4>输入类型</h4>
      <p>input标签支持多种类型：text, email, password, number, date等</p>
    `,
    codeExample: `<form>
    <label for="name">姓名：</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">邮箱：</label>
    <input type="email" id="email" name="email" required>
    
    <label for="age">年龄：</label>
    <input type="number" id="age" name="age" min="1" max="120">
    
    <label for="message">留言：</label>
    <textarea id="message" name="message" rows="4"></textarea>
    
    <button type="submit">提交</button>
</form>`,
    exercise: {
      description: '创建一个联系表单，包含姓名、邮箱、电话和留言字段。'
    },
    aiSuggestion: '表单要设置合适的输入类型和验证属性，提升用户体验。'
  },
  {
    title: '语义化标签',
    difficulty: '初级',
    duration: '15分钟',
    content: `
      <h4>HTML5语义化标签</h4>
      <p>HTML5引入了更多语义化标签，让页面结构更清晰：</p>
      <ul>
        <li><code>&lt;header&gt;</code> - 页面头部</li>
        <li><code>&lt;nav&gt;</code> - 导航</li>
        <li><code>&lt;main&gt;</code> - 主要内容</li>
        <li><code>&lt;section&gt;</code> - 章节</li>
        <li><code>&lt;article&gt;</code> - 文章</li>
        <li><code>&lt;aside&gt;</code> - 侧边栏</li>
        <li><code>&lt;footer&gt;</code> - 页脚</li>
      </ul>
    `,
    codeExample: `<header>
    <h1>网站标题</h1>
    <nav>
        <a href="#home">首页</a>
        <a href="#about">关于</a>
        <a href="#contact">联系</a>
    </nav>
</header>

<main>
    <article>
        <h2>文章标题</h2>
        <p>文章内容...</p>
    </article>
    
    <aside>
        <h3>相关链接</h3>
        <ul>
            <li><a href="#">链接1</a></li>
            <li><a href="#">链接2</a></li>
        </ul>
    </aside>
</main>

<footer>
    <p>&copy; 2024 我的网站</p>
</footer>`,
    exercise: {
      description: '使用语义化标签重新组织一个完整的网页结构。'
    },
    aiSuggestion: '语义化标签不仅让代码更易读，还能提升SEO和可访问性。'
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
    ElMessage.success('恭喜！HTML基础学习完成！')
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
}

const openExercise = () => {
  ElMessage.info('练习功能开发中...')
}

const showHint = () => {
  ElMessage.info('提示功能开发中...')
}

const askAI = () => {
  ElMessage.info('AI问答功能开发中...')
}
</script>

<style scoped>
.html-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .html-learn {
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


.exercise-section {
  margin: 24px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.dark .exercise-section {
  background: #374151;
}

.exercise-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
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

.ai-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 300px;
  z-index: 1000;
}

.ai-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ai-icon {
  font-size: 18px;
}

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-suggestion {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.el-card__body) {
  padding: 16px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>

