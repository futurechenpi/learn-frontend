export interface Lesson {
  title: string
  difficulty: string
  duration: string
  content: string
  codeExample?: string
  exercise?: { description: string }
  aiSuggestion?: string
  preview?: string
}

export interface CourseConfig {
  pageName: string
  routeName: string
  totalSteps: number
  progressKey: string
  codeLanguage: string
  exerciseRouteName: string
  aiCourseName: string
  hasExerciseSection: boolean
  hasPreview: boolean
  completionMessage: string
  lessons: Lesson[]
}

export const htmlConfig: CourseConfig = {
  pageName: 'HTML 基础学习',
  routeName: 'learn-html',
  totalSteps: 5,
  progressKey: 'html',
  codeLanguage: 'html',
  exerciseRouteName: 'exercise-html',
  aiCourseName: 'HTML',
  hasExerciseSection: true,
  hasPreview: false,
  completionMessage: '恭喜！HTML基础学习完成！',
  lessons: [
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
      exercise: { description: '创建一个简单的HTML页面，包含标题和段落。' },
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
      exercise: { description: '使用不同的HTML标签创建一个包含标题、段落、链接和图片的页面。' },
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
      exercise: { description: '创建一个包含列表和表格的页面，展示你的个人信息。' },
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
      exercise: { description: '创建一个联系表单，包含姓名、邮箱、电话和留言字段。' },
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
      exercise: { description: '使用语义化标签重新组织一个完整的网页结构。' },
      aiSuggestion: '语义化标签不仅让代码更易读，还能提升SEO和可访问性。'
    }
  ]
}

export const cssConfig: CourseConfig = {
  pageName: 'CSS 样式学习',
  routeName: 'learn-css',
  totalSteps: 4,
  progressKey: 'css',
  codeLanguage: 'css',
  exerciseRouteName: 'exercise-css',
  aiCourseName: 'CSS',
  hasExerciseSection: false,
  hasPreview: true,
  completionMessage: '恭喜！CSS学习完成！',
  lessons: [
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
}

export const jsConfig: CourseConfig = {
  pageName: 'JavaScript 编程学习',
  routeName: 'learn-javascript',
  totalSteps: 5,
  progressKey: 'javascript',
  codeLanguage: 'javascript',
  exerciseRouteName: 'exercise-js',
  aiCourseName: 'JavaScript',
  hasExerciseSection: false,
  hasPreview: false,
  completionMessage: '恭喜！JavaScript学习完成！',
  lessons: [
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
}

export const vue3Config: CourseConfig = {
  pageName: 'Vue3 框架学习',
  routeName: 'learn-vue3',
  totalSteps: 6,
  progressKey: 'vue3',
  codeLanguage: 'vue',
  exerciseRouteName: 'exercise',
  aiCourseName: 'Vue3',
  hasExerciseSection: false,
  hasPreview: false,
  completionMessage: '恭喜！Vue3学习完成！',
  lessons: [
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

function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  return { count, increment, decrement, reset }
}

const { count, increment, decrement, reset } = useCounter(10)
<\/script>`
    }
  ]
}

export const reactConfig: CourseConfig = {
  pageName: 'React 框架学习',
  routeName: 'learn-react',
  totalSteps: 4,
  progressKey: 'react',
  codeLanguage: 'react',
  exerciseRouteName: 'exercise',
  aiCourseName: 'React',
  hasExerciseSection: false,
  hasPreview: false,
  completionMessage: '恭喜！React学习完成！',
  lessons: [
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
}

export const tsConfig: CourseConfig = {
  pageName: 'TypeScript 类型安全学习',
  routeName: 'learn-typescript',
  totalSteps: 4,
  progressKey: 'typescript',
  codeLanguage: 'typescript',
  exerciseRouteName: 'exercise',
  aiCourseName: 'TypeScript',
  hasExerciseSection: false,
  hasPreview: false,
  completionMessage: '恭喜！TypeScript学习完成！',
  lessons: [
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
}

export const tailwindcssConfig: CourseConfig = {
  pageName: 'TailwindCSS 实用优先学习',
  routeName: 'learn-tailwindcss',
  totalSteps: 4,
  progressKey: 'tailwindcss',
  codeLanguage: 'html',
  exerciseRouteName: 'exercise',
  aiCourseName: 'TailwindCSS',
  hasExerciseSection: false,
  hasPreview: false,
  completionMessage: '恭喜！TailwindCSS学习完成！',
  lessons: [
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
}

export const allConfigs: Record<string, CourseConfig> = {
  html: htmlConfig,
  css: cssConfig,
  javascript: jsConfig,
  vue3: vue3Config,
  react: reactConfig,
  typescript: tsConfig,
  tailwindcss: tailwindcssConfig
}
