<template>
  <div class="js-learn">
    <div class="learn-container">
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            JavaScript 编程学习
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
              <CodeHighlighter 
                :code="currentLesson.codeExample" 
                language="javascript"
                title="JavaScript 代码"
              />
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
import { ElMessage } from 'element-plus'
import CodeHighlighter from '@/components/CodeHighlighter.vue'

const currentStep = ref(1)
const totalSteps = ref(5)

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100)
})

const lessons = [
  {
    title: 'JavaScript 基础语法',
    difficulty: '入门',
    duration: '15分钟',
    content: `
      <h4>什么是JavaScript？</h4>
      <p>JavaScript是一种动态编程语言，用于为网页添加交互性和动态效果。</p>
      
      <h4>变量声明</h4>
      <p>JavaScript有三种声明变量的方式：</p>
      <ul>
        <li><code>var</code> - 函数作用域</li>
        <li><code>let</code> - 块作用域</li>
        <li><code>const</code> - 常量，不可重新赋值</li>
      </ul>
      
      <h4>数据类型</h4>
      <p>JavaScript有7种基本数据类型：number, string, boolean, null, undefined, symbol, bigint</p>
    `,
    codeExample: `// 变量声明
let name = "张三";
const age = 25;
var isStudent = true;

// 数据类型
let number = 42;
let text = "Hello World";
let isActive = true;
let empty = null;
let notDefined = undefined;

// 输出到控制台
console.log(name, age, number);`
  },
  {
    title: '函数和作用域',
    difficulty: '入门',
    duration: '18分钟',
    content: `
      <h4>函数定义</h4>
      <p>函数是JavaScript中的基本构建块，用于封装可重用的代码：</p>
      
      <h4>函数声明方式</h4>
      <ul>
        <li>函数声明：<code>function name() {}</code></li>
        <li>函数表达式：<code>const name = function() {}</code></li>
        <li>箭头函数：<code>const name = () => {}</code></li>
      </ul>
      
      <h4>作用域</h4>
      <p>作用域决定了变量的可见性，JavaScript有全局作用域和局部作用域。</p>
    `,
    codeExample: `// 函数声明
function greet(name) {
    return "Hello, " + name + "!";
}

// 函数表达式
const add = function(a, b) {
    return a + b;
};

// 箭头函数
const multiply = (a, b) => a * b;

// 作用域示例
let globalVar = "全局变量";

function scopeExample() {
    let localVar = "局部变量";
    console.log(globalVar); // 可以访问
    console.log(localVar);  // 可以访问
}

console.log(globalVar); // 可以访问
// console.log(localVar); // 错误：无法访问`
  },
  {
    title: '对象和数组',
    difficulty: '初级',
    duration: '20分钟',
    content: `
      <h4>对象</h4>
      <p>对象是键值对的集合，用于存储和组织数据：</p>
      
      <h4>数组</h4>
      <p>数组是有序的数据集合，可以存储多个值：</p>
      
      <h4>常用方法</h4>
      <ul>
        <li><code>push()</code> - 添加元素到数组末尾</li>
        <li><code>pop()</code> - 移除数组末尾的元素</li>
        <li><code>forEach()</code> - 遍历数组</li>
        <li><code>map()</code> - 创建新数组</li>
        <li><code>filter()</code> - 过滤数组元素</li>
      </ul>
    `,
    codeExample: `// 对象
const person = {
    name: "张三",
    age: 25,
    city: "北京",
    greet: function() {
        return "我是 " + this.name;
    }
};

// 访问对象属性
console.log(person.name);
console.log(person["age"]);
console.log(person.greet());

// 数组
const fruits = ["苹果", "香蕉", "橙子"];

// 添加元素
fruits.push("葡萄");

// 遍历数组
fruits.forEach(fruit => {
    console.log(fruit);
});

// 使用map创建新数组
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log(upperFruits);`
  },
  {
    title: 'DOM操作',
    difficulty: '初级',
    duration: '22分钟',
    content: `
      <h4>什么是DOM？</h4>
      <p>DOM（Document Object Model）是HTML文档的编程接口，允许JavaScript操作网页元素。</p>
      
      <h4>选择元素</h4>
      <ul>
        <li><code>getElementById()</code> - 通过ID选择</li>
        <li><code>querySelector()</code> - 通过CSS选择器选择</li>
        <li><code>querySelectorAll()</code> - 选择所有匹配的元素</li>
      </ul>
      
      <h4>修改元素</h4>
      <ul>
        <li><code>textContent</code> - 修改文本内容</li>
        <li><code>innerHTML</code> - 修改HTML内容</li>
        <li><code>style</code> - 修改样式</li>
        <li><code>classList</code> - 修改CSS类</li>
      </ul>
    `,
    codeExample: `// 选择元素
const button = document.getElementById("myButton");
const title = document.querySelector("h1");
const paragraphs = document.querySelectorAll("p");

// 修改内容
title.textContent = "新的标题";
title.innerHTML = "<em>强调的标题</em>";

// 修改样式
title.style.color = "blue";
title.style.fontSize = "24px";

// 修改类
title.classList.add("highlight");
title.classList.remove("old-class");

// 添加事件监听器
button.addEventListener("click", function() {
    alert("按钮被点击了！");
});`
  },
  {
    title: '异步编程',
    difficulty: '中级',
    duration: '25分钟',
    content: `
      <h4>异步编程概念</h4>
      <p>JavaScript是单线程的，但通过异步编程可以处理耗时操作而不阻塞主线程。</p>
      
      <h4>Promise</h4>
      <p>Promise是处理异步操作的对象，有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。</p>
      
      <h4>async/await</h4>
      <p>async/await是处理Promise的语法糖，让异步代码看起来像同步代码。</p>
      
      <h4>常用异步操作</h4>
      <ul>
        <li><code>fetch()</code> - 发送HTTP请求</li>
        <li><code>setTimeout()</code> - 延迟执行</li>
        <li><code>setInterval()</code> - 定时执行</li>
      </ul>
    `,
    codeExample: `// Promise示例
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve("数据获取成功");
            } else {
                reject("数据获取失败");
            }
        }, 1000);
    });
}

// 使用Promise
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// 使用async/await
async function handleData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

// 使用fetch发送HTTP请求
async function getUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        console.log(users);
    } catch (error) {
        console.error('请求失败:', error);
    }
}`
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
    ElMessage.success('恭喜！JavaScript基础学习完成！')
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
}
</script>

<style scoped>
.js-learn {
  height: 100%;
  background: #f8fafc;
  overflow-y: auto;
}

.dark .js-learn {
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

