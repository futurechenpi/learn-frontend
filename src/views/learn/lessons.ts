// 统一管理练习课程的代码模板与标题映射，供各练习页按路由(step)加载

export type HtmlCssJs = { html: string; css: string; js: string; hints: string[] }
export type HtmlCss = { html: string; css: string; hints: string[] }
export type HtmlJs = { html: string; js: string; hints: string[] }

export const htmlLessons: Record<number, HtmlCssJs> = {
  1: {
    html: `<!DOCTYPE html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8"/>\n    <title>我的第一个网页</title>\n  </head>\n  <body>\n    <h1>欢迎来到我的网站！</h1>\n    <p>这是我的第一个HTML页面。</p>\n  </body>\n</html>`,
    css: `body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }\nh1 { color: var(--el-color-primary); }`,
    js: `console.log('Hello HTML!')`,
    hints: ['包含 <!DOCTYPE html>', '包含一个 <h1> 与一个 <p>', '尝试修改标题文本']
  },
  2: {
    html: `<h1>主标题</h1>\n<p>这是一个<strong>重要</strong>的段落，包含<em>斜体</em>文本。</p>\n<a href="#">示例链接</a>\n<img src="example.jpg" alt="示例图片" />`,
    css: `img{max-width:100%;}`,
    js: ``,
    hints: ['包含一个 <h1>', '包含一个 <p>', '使用 <strong> 或 <em>', '包含 <a> 或 <img>']
  },
  3: {
    html: `<ul>\n  <li>苹果</li>\n  <li>香蕉</li>\n</ul>\n<table>\n  <tr><th>姓名</th><th>年龄</th></tr>\n  <tr><td>张三</td><td>25</td></tr>\n</table>`,
    css: `table{border-collapse:collapse} th,td{border:1px solid #ddd;padding:6px 10px}`,
    js: ``,
    hints: ['包含 <ul> 或 <ol>', '包含至少一个 <li>', '包含 <table> 与 <tr>/<td>/<th>']
  },
  4: {
    html: `<form>\n  <label>姓名：<input type="text" required /></label>\n  <label>邮箱：<input type="email" required /></label>\n  <button type="submit">提交</button>\n</form>`,
    css: `label{display:block;margin:6px 0}`,
    js: `document.querySelector('form')?.addEventListener('submit',e=>{e.preventDefault();alert('已提交')})`,
    hints: ['包含 <form>', '包含 <input> 或 <textarea>', '包含提交 <button>']
  },
  5: {
    html: `<header>\n  <h1>网站标题</h1>\n</header>\n<main>\n  <section>\n    <article>\n      <h2>文章标题</h2>\n      <p>文章内容...</p>\n    </article>\n  </section>\n  <aside>\n    <h3>侧栏</h3>\n  </aside>\n</main>\n<footer>页脚</footer>`,
    css: `header,footer{padding:8px 0}`,
    js: ``,
    hints: ['包含 <header>/<footer>', '包含 <main> 与 <section> 或 <article>']
  }
}

export const htmlTitles: Record<number, string> = {
  1: 'HTML 简介和基础结构',
  2: '常用HTML标签',
  3: '列表和表格',
  4: '表单元素',
  5: '语义化标签'
}

export const cssLessons: Record<number, HtmlCss> = {
  1: {
    html: `<div class="card">卡片</div>`,
    css: `.card{padding:16px;border:1px solid #ccc;border-radius:8px;background:#f8fafc}`,
    hints: ['编写一个类选择器 .card', '为其添加 padding 与边框', '设置圆角与背景色']
  },
  2: {
    html: `<div class="grid">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
    css: `.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.item{background:#e5e7eb;padding:10px;text-align:center}`,
    hints: ['使用 display:grid', '设置 repeat(3,1fr)', '使用 gap 控制间距']
  },
  3: {
    html: `<nav class="nav"><a>首页</a><a>课程</a><a>联系</a></nav>`,
    css: `.nav{display:flex;gap:12px;background:#111827;color:#fff;padding:8px;border-radius:6px}.nav a{color:inherit;text-decoration:none}`,
    hints: ['使用 flex 水平排列', '设置 gap 间距', '让链接继承颜色']
  },
  4: {
    html: `<button class="btn">按钮</button>`,
    css: `.btn{padding:8px 12px;border:1px solid var(--el-border-color);background:var(--el-fill-color);border-radius:6px}
.btn:hover{background:var(--el-fill-color-darker)}`,
    hints: ['使用 Element Plus 变量', '添加 :hover 态']
  }
}

export const cssTitles: Record<number, string> = {
  1: 'CSS 基础语法',
  2: '选择器详解',
  3: '盒模型和布局',
  4: '响应式设计'
}

export const jsLessons: Record<number, HtmlJs> = {
  1: {
    html: `<button id="btn">点我</button>\n<p id="out"></p>`,
    js: `document.getElementById('btn')?.addEventListener('click',()=>{\n  const out=document.getElementById('out');\n  if(out) out.textContent='按钮已点击';\n})`,
    hints: ['获取按钮元素', '绑定 click 事件', '修改段落文本']
  },
  2: {
    html: `<input id="name" placeholder="输入名字"/>\n<button id="hello">打招呼</button>\n<p id="msg"></p>`,
    js: `document.getElementById('hello')?.addEventListener('click',()=>{\n  const name = (document.getElementById('name') as HTMLInputElement)?.value || '同学';\n  const msg = document.getElementById('msg');\n  if (msg) msg.textContent = '你好，' + name + '！';\n})`,
    hints: ['读取输入框的值', '字符串拼接/模板字符串', '点击后更新页面']
  },
  3: {
    html: `<ul id="list"></ul>`,
    js: `const items=['苹果','香蕉','橙子'];\nconst ul=document.getElementById('list');\nif(ul){\n  items.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ul.appendChild(li) })\n}`,
    hints: ['遍历数组', '创建 li 元素', 'appendChild 插入 DOM']
  },
  4: {
    html: `<p id="time"></p>`,
    js: `setInterval(()=>{\n  const el=document.getElementById('time');\n  if(el) el.textContent = new Date().toLocaleTimeString();\n},1000)`,
    hints: ['使用 setInterval', '每秒更新时间', 'toLocaleTimeString']
  },
  5: {
    html: `<button id="load">加载数据</button>\n<pre id="out"></pre>`,
    js: `document.getElementById('load')?.addEventListener('click', async ()=>{\n  try{\n    const res = await fetch('https://api.github.com/repos/vuejs/core');\n    const data = await res.json();\n    (document.getElementById('out')||{}).textContent = JSON.stringify({stargazers:data.stargazers_count,name:data.name}, null, 2)\n  }catch(e){ console.error(e) }\n})`,
    hints: ['fetch 发起请求', 'await/async', '在页面显示结果']
  }
}

export const jsTitles: Record<number, string> = {
  1: 'JavaScript 基础语法',
  2: '函数和作用域',
  3: '对象和数组',
  4: 'DOM操作',
  5: '异步编程'
}

export type VueLesson = { html: string; js: string; hints: string[] }
export type ReactLesson = { html: string; js: string; hints: string[] }
export type TsLesson = { html: string; js: string; hints: string[] }
export type TwLesson = { html: string; css: string; hints: string[] }

export const vue3Lessons: Record<number, VueLesson> = {
  1: {
    html: `<div id="app">
  <h1>{{ message }}</h1>
  <button @click="reverse">反转文字</button>
</div>`,
    js: `const { createApp, ref } = Vue

createApp({
  setup() {
    const message = ref('Hello Vue3!')
    const reverse = () => {
      message.value = message.value.split('').reverse().join('')
    }
    return { message, reverse }
  }
}).mount('#app')`,
    hints: ['使用 createApp 创建应用', '使用 ref 定义响应式数据', '使用 @click 绑定事件']
  },
  2: {
    html: `<div id="app">
  <input v-model="text" placeholder="输入内容" />
  <p>你输入了：{{ text }}</p>
  <p>字符数：{{ text.length }}</p>
</div>`,
    js: `const { createApp, ref, computed } = Vue

createApp({
  setup() {
    const text = ref('')
    return { text }
  }
}).mount('#app')`,
    hints: ['使用 v-model 双向绑定', '模板中直接使用 .length', 'ref 值在模板中自动解包']
  },
  3: {
    html: `<div id="app">
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ index + 1 }}. {{ item }}
    </li>
  </ul>
  <input v-model="newItem" @keyup.enter="add" placeholder="新增项" />
</div>`,
    js: `const { createApp, ref } = Vue

createApp({
  setup() {
    const items = ref(['学习 Vue3', '写代码', '调试'])
    const newItem = ref('')
    const add = () => {
      if (newItem.value.trim()) {
        items.value.push(newItem.value.trim())
        newItem.value = ''
      }
    }
    return { items, newItem, add }
  }
}).mount('#app')`,
    hints: ['使用 v-for 渲染列表', ':key 绑定唯一标识', '@keyup.enter 监听回车键']
  },
  4: {
    html: `<div id="app">
  <button @click="show = !show">{{ show ? '隐藏' : '显示' }}内容</button>
  <transition name="fade">
    <p v-if="show">这是渐隐渐现的内容</p>
  </transition>
</div>`,
    js: `const { createApp, ref } = Vue

createApp({
  setup() {
    const show = ref(true)
    return { show }
  }
}).mount('#app')

// CSS 需要添加过渡动画样式`,
    hints: ['v-if 条件渲染', '<transition> 内置过渡组件', '配合 CSS transition 动画']
  },
  5: {
    html: `<div id="app">
  <todo-item
    v-for="(todo, i) in todos"
    :key="todo.id"
    :title="todo.title"
    @remove="removeTodo(i)"
  ></todo-item>
</div>

<script type="module">
// 见 JS 区
</` + `script>`,
    js: `const { createApp, ref } = Vue

const TodoItem = {
  props: ['title'],
  emits: ['remove'],
  template: \`
    <span>{{ title }}
      <button @click="$emit('remove')">✕</button>
    </span>
  \`
}

createApp({
  components: { TodoItem },
  setup() {
    const todos = ref([
      { id: 1, title: '学习 Composition API' },
      { id: 2, title: '了解 Vue Router' },
      { id: 3, title: '掌握 Pinia 状态管理' }
    ])
    const removeTodo = (index: number) => {
      todos.value.splice(index, 1)
    }
    return { todos, removeTodo }
  }
}).mount('#app')`,
    hints: ['定义子组件 props 和 emits', 'v-for 中使用子组件', '$emit 触发父组件事件']
  },
  6: {
    html: `<div id="app">
  <h2>待办事项</h2>
  <input v-model="newTodo" @keyup.enter="addTodo" placeholder="添加新任务..." />
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id"
      :style="{ textDecoration: todo.done ? 'line-through' : 'none' }">
      <input type="checkbox" v-model="todo.done" />
      {{ todo.text }}
      <button @click="removeTodo(todo.id)">删除</button>
    </li>
  </ul>
  <p>剩余：{{ remainingCount }} 项</p>
</div>`,
    js: `const { createApp, ref, computed } = Vue

createApp({
  setup() {
    const newTodo = ref('')
    const todos = ref([
      { id: 1, text: '学习 Vue3 Composition API', done: false },
      { id: 2, text: '了解 Vue Router 路由', done: true },
      { id: 3, text: '掌握 Pinia 状态管理', done: false }
    ])

    const filteredTodos = computed(() => todos.value)
    const remainingCount = computed(() => todos.value.filter(t => !t.done).length)

    function addTodo() {
      if (newTodo.value.trim()) {
        todos.value.push({ id: Date.now(), text: newTodo.value.trim(), done: false })
        newTodo.value = ''
      }
    }

    function removeTodo(id: number) {
      todos.value = todos.value.filter(t => t.id !== id)
    }

    return { newTodo, todos, filteredTodos, remainingCount, addTodo, removeTodo }
  }
}).mount('#app')`,
    hints: ['computed 计算属性自动缓存', 'v-model 绑定 checkbox 和 input', 'computed 依赖响应式数据自动更新']
  }
}
export const vue3Titles: Record<number, string> = {
  1: 'Vue3 基础与响应式',
  2: '双向绑定 v-model',
  3: '列表渲染 v-for',
  4: '条件渲染与过渡',
  5: '组件通信 props/emit',
  6: '计算属性与侦听器'
}

export const reactLessons: Record<number, ReactLesson> = {
  1: {
    html: `<div id="root"></div>`,
    js: `const { useState } = React

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>计数：{count}</h1>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Counter />)`,
    hints: ['使用 useState 定义状态', 'JSX 语法编写 UI', 'onClick 事件处理']
  },
  2: {
    html: `<div id="root"></div>`,
    js: `const { useState } = React

function TodoList() {
  const [todos, setTodos] = useState(['学 React', '写组件', '部署上线'])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()])
      setInput('')
    }
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()} placeholder="输入待办..." />
      <button onClick={addTodo}>添加</button>
      <ul>{todos.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<TodoList />)`,
    hints: ['useState 管理数组状态', '展开运算符 [...arr, item]', '.map() 渲染列表 + key 属性']
  },
  3: {
    html: `<div id="root"></div>`,
    js: `const { useState, useEffect } = React

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <h1>{time}</h1>
}

ReactDOM.createRoot(document.getElementById('root')).render(<Clock />)`,
    hints: ['useEffect 副作用钩子', 'setInterval 定时器', '清理函数 return clearInterval']
  },
  4: {
    html: `<div id="root"></div>`,
    js: `function Card({ title, children }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

function App() {
  return (
    <Card title="我的卡片">
      <p>这是卡片的内容区域</p>
      <button>操作按钮</button>
    </Card>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)`,
    hints: ['函数组件接收 props', 'children 插槽模式', '内联 style 对象写法']
  }
}
export const reactTitles: Record<number, string> = {
  1: 'React 基础与 JSX',
  2: 'useState 列表操作',
  3: 'useEffect 副作用处理',
  4: '组件设计与 children'
}

export const tsLessons: Record<number, TsLesson> = {
  1: {
    html: `<div id="output"></div>`,
    js: `// 基本类型注解
let name: string = 'TypeScript'
let age: number = 25
let isStudent: boolean = true
let hobbies: string[] = ['编程', '阅读', '运动']

// 函数类型注解
function greet(person: string): string {
  return \`你好，\${person}！今年\${age}岁\`
}

// 显示结果
const el = document.getElementById('output')
if (el) el.innerHTML = \`<p>\${greet(name)}</p><p>爱好：\${hobbies.join('、')}</p>\``,
    hints: ['变量后加 :Type 声明类型', '函数参数和返回值都要标注', '数组用 Type[] 或 Array<Type>']
  },
  2: {
    html: `<div id="output"></div>`,
    js: `// 接口定义对象形状
interface User {
  name: string
  age: number
  email?: string    // 可选属性
  readonly id: number // 只读属性
}

interface Address {
  city: string
  street: string
}

interface Member extends User {
  address: Address   // 嵌套接口
  role: 'admin' | 'user' | 'guest' // 联合类型
}

const member: Member = {
  id: 1,
  name: '张三',
  age: 28,
  role: 'admin',
  address: { city: '北京', street: '科技路' }
}

const el = document.getElementById('output')
if (el) el.textContent = JSON.stringify(member, null, 2)`,
    hints: ['interface 定义对象结构', '? 表示可选属性', 'extends 继承接口']
  },
  3: {
    html: `<div id="output"></div>`,
    js: `// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 泛型接口
interface Response<T> {
  code: number
  data: T
  message: string
}

// 使用泛型
const numRes: Response<number> = { code: 200, data: 42, message: 'OK' }
const strRes: Response<string> = { code: 200, data: 'hello', message: 'OK' }

// 泛型类
class Stack<T> {
  private items: T[] = []
  push(item: T) { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
  get size() { return this.items.length }
}

const stack = new Stack<string>()
stack.push('a')
stack.push('b')

const el = document.getElementById('output')
if (el) el.textContent = \`栈大小：\${stack.size}，弹出：\${stack.pop()}\``,
    hints: ['<T> 声明泛型参数', '泛型可复用于多种类型', '泛型约束类和方法']
  },
  4: {
    html: `<div id="output"></div>`,
    js: `// 字面量类型与联合类型
type Direction = 'up' | 'down' | 'left' | 'right'
type Status = 'loading' | 'success' | 'error'

// 类型守卫
function processStatus(status: Status): string {
  switch (status) {
    case 'loading': return '加载中...'
    case 'success': return '操作成功 ✓'
    case 'error': return '出错了 ✗'
    default: const _exhaustive: never = status; return _exhaustive
  }
}

// Partial / Required 工具类型
interface Todo {
  id: number
  title: string
  done: boolean
}

function updateTodo(id: number, fields: Partial<Todo>) {
  console.log('更新 ID:', id, '字段:', fields)
  return { id, ...fields }
}

const updated = updateTodo(1, { done: true })
const el = document.getElementById('output')
if (el) el.textContent = \`状态：\${processStatus('success')}\\n更新：\${JSON.stringify(updated)}\``,
    hints: ['type 定义类型别名', 'never 类型实现穷尽检查', 'Partial<T> 将所有属性变可选']
  }
}
export const tsTitles: Record<number, string> = {
  1: 'TypeScript 基础类型',
  2: '接口与类型扩展',
  3: '泛型编程',
  4: '高级类型与工具类型'
}

export const twLessons: Record<number, TwLesson> = {
  1: {
    html: `<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Tailwind 卡片</h1>
    <p class="text-gray-600 mb-6">这是一个使用 Tailwind CSS 构建的卡片组件</p>
    <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
      点击按钮
    </button>
  </div>
</div>`,
    css: ``,
    hints: ['使用 flex 布局居中', 'bg-* 设置背景色', 'rounded-* 圆角 + shadow 阴影']
  },
  2: {
    html: `<nav class="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
  <div class="text-xl font-bold">MyApp</div>
  <div class="hidden md:flex gap-6">
    <a href="#" class="hover:text-blue-400 transition-colors">首页</a>
    <a href="#" class="hover:text-blue-400 transition-colors">产品</a>
    <a href="#" class="hover:text-blue-400 transition-colors">关于</a>
  </div>
  <button class="md:hidden p-2">菜单</button>
</nav>`,
    css: ``,
    hints: ['md: 断点响应式', 'hidden/md:flex 控制显隐', 'hover: 伪类 + transition 过渡']
  },
  3: {
    html: `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
    <div class="p-4">
      <h3 class="font-semibold text-lg">文章标题一</h3>
      <p class="text-gray-500 text-sm mt-1">这是一段描述文字...</p>
    </div>
  </div>
  <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div class="bg-gradient-to-r from-green-400 to-cyan-500 h-32"></div>
    <div class="p-4">
      <h3 class="font-semibold text-lg">文章标题二</h3>
      <p class="text-gray-500 text-sm mt-1">另一段描述文字...</p>
    </div>
  </div>
  <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div class="bg-gradient-to-r from-orange-400 to-red-500 h-32"></div>
    <div class="p-4">
      <h3 class="font-semibold text-lg">文章标题三</h3>
      <p class="text-gray-500 text-sm mt-1">第三段描述文字...</p>
    </div>
  </div>
</div>`,
    css: ``,
    hints: ['grid-cols-* 响应式网格', 'gap 控制间距', 'gradient-to-r 渐变色 + overflow-hidden 裁剪圆角']
  },
  4: {
    html: `<div class="max-w-md mx-auto p-6 space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
    <input type="text" placeholder="请输入用户名"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
    <input type="password" placeholder="请输入密码"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
  </div>
  <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors">
    登录
  </button>
</div>`,
    css: ``,
    hints: ['focus:ring 聚焦环效果', 'space-y 垂直间距', 'max-w-* 限制最大宽度']
  }
}
export const twTitles: Record<number, string> = {
  1: 'Tailwind 基础布局',
  2: '响应式导航栏',
  3: 'Grid 网格布局',
  4: '表单样式设计'
}


