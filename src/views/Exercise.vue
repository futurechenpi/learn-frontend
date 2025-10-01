<template>
  <div class="exercise-page">
    <header class="page-header">
      <div class="left">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>实战练习 · {{ courseLabel }}</h1>
        <span class="desc">第 {{ step }} 课 · {{ subtitle }}</span>
      </div>
      <div class="right">
        <el-button @click="resetAll">重置</el-button>
        <el-button @click="run">运行</el-button>
        <el-button @click="goPrev" :disabled="step <= 1">上一课</el-button>
        <el-button type="primary" @click="goNext" :disabled="step >= maxStep">下一课</el-button>
      </div>
    </header>

    <main class="main">
      <section class="editor">
        <div class="editor-toolbar">
          <el-tabs v-model="activeTab" class="flex-1" />
          <div class="tools">
            <el-button size="small" @click="formatCode">格式化</el-button>
          </div>
        </div>
        <div class="editor-tabs">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="HTML" name="html">
              <div class="editor-host" ref="htmlHost"></div>
            </el-tab-pane>
            <el-tab-pane label="CSS" name="css">
              <div class="editor-host" ref="cssHost"></div>
            </el-tab-pane>
            <el-tab-pane label="JavaScript" name="js">
              <div class="editor-host" ref="jsHost"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="preview">
          <iframe :srcdoc="srcdoc" ref="iframeRef"></iframe>
        </div>
      </section>

      <aside class="sidebar">
        <div class="hints">
          <div class="hints-header">
            <h3>练习提示</h3>
            <el-button text size="small" @click="toggleHints">{{ showHints ? '收起' : '查看提示' }}</el-button>
          </div>
          <ul v-show="showHints" class="list">
            <li v-for="(h, i) in hints" :key="i">{{ h }}</li>
          </ul>
        </div>
        <div class="assistant">
          <AIAssistant />
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import AIAssistant from '@/components/AIAssistant.vue'

const route = useRoute()
const router = useRouter()
const course = computed(() => String(route.params.course || 'html'))
const step = computed(() => Number(route.params.step || 1))
const courseLabel = computed(() => course.value.toUpperCase())
const subtitle = computed(() => String(route.query.title || '实时编辑与预览'))
// 仅为 HTML 课程提供标题映射，用于在下一课/上一课时同步小标题
const htmlTitles: Record<number, string> = {
  1: 'HTML 简介和基础结构',
  2: '常用HTML标签',
  3: '列表和表格',
  4: '表单元素',
  5: '语义化标签'
}

const activeTab = ref<'html' | 'css' | 'js'>('html')
const html = ref('')
const css = ref('')
const js = ref('')
const htmlHost = ref<HTMLElement>()
const cssHost = ref<HTMLElement>()
const jsHost = ref<HTMLElement>()
let htmlEditor: any
let cssEditor: any
let jsEditor: any
const iframeRef = ref<HTMLIFrameElement>()

const defaults: Record<string, Record<number, { html: string; css: string; js: string; hints: string[] }>> = {
  html: {
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
  },
  css: {
    1: {
      html: `<div class="card">卡片</div>`,
      css: `.card{padding:16px;border:1px solid #ccc;border-radius:8px;background:#f8fafc}`,
      js: ``,
      hints: ['编写一个类选择器 .card', '为其添加 padding 与边框', '设置圆角与背景色']
    }
  },
  javascript: {
    1: {
      html: `<button id="btn">点我</button>\n<p id="out"></p>`,
      css: `#btn{padding:8px 12px;border:1px solid var(--el-border-color);border-radius:6px}`,
      js: `document.getElementById('btn')?.addEventListener('click',()=>{\n  const out=document.getElementById('out');\n  if(out) out.textContent='按钮已点击';\n})`,
      hints: ['获取按钮元素', '绑定 click 事件', '修改段落文本']
    }
  },
  vue3: {
    1: {
      html: `<div id="app">\n  <h2>{{ title }}</h2>\n  <button @click="count++">{{ count }}</button>\n</div>`,
      css: `button{padding:6px 10px;border:1px solid var(--el-border-color);border-radius:6px}`,
      js: `const { createApp, ref } = window.Vue || {};\nif (createApp){\n  createApp({\n    setup(){\n      const title = ref('Vue3 练习');\n      const count = ref(0);\n      return { title, count };\n    }\n  }).mount('#app')\n}`,
      hints: ['使用 Vue3 createApp', '使用 ref 创建响应式数据', '实现按钮点击自增']
    }
  },
  react: {
    1: {
      html: `<div id="root"></div>`,
      css: `#root{font-family:system-ui;padding:10px}`,
      js: `const e = React.createElement;\nfunction App(){ return e('div', null, e('h3', null, 'React 练习')) }\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(e(App))`,
      hints: ['使用 ReactDOM.createRoot', '创建一个函数组件 App', '渲染到 #root']
    }
  },
  typescript: {
    1: {
      html: `<pre id="out"></pre>`,
      css: `#out{background:#f8fafc;border:1px solid var(--el-border-color);padding:8px;border-radius:6px}`,
      js: `// 简化：在浏览器中直接写 TS 风格注释示例\n/** @type {{name:string, age:number}} */\nconst user = { name: '张三', age: 20 };\n(document.getElementById('out')||{}).textContent = JSON.stringify(user)`,
      hints: ['声明一个对象并包含类型信息', '把结果输出到页面']
    }
  },
  tailwindcss: {
    1: {
      html: `<div class="p-4 bg-blue-100 rounded">\n  <h2 class="text-blue-600 font-bold">Tailwind 练习</h2>\n  <p class="text-gray-600 mt-2">应用基础工具类</p>\n</div>`,
      css: ``,
      js: ``,
      hints: ['添加 padding 与 rounded', '使用 text- 与 bg- 颜色类', '调整外边距 mt-*']
    }
  }
}

const srcdoc = computed(() => {
  return `<!DOCTYPE html><html><head><style>${css.value}\n:root{--el-color-primary:${getPrimary()}}\n</style></head><body>${html.value}<script>try{${js.value}}catch(e){console.error(e)}</` + `script></body></html>`
})

function getPrimary() {
  return getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary') || '#3b82f6'
}

const hints = computed(() => {
  return defaults[course.value]?.[step.value]?.hints || []
})

const courseMax: Record<string, number> = {
  html: 5,
  css: 4,
  javascript: 5,
  vue3: 6,
  react: 4,
  typescript: 4,
  tailwindcss: 4
}

const maxStep = computed(() => {
  const map = defaults[course.value] || {}
  const keys = Object.keys(map).map(k => Number(k)).filter(n => !Number.isNaN(n))
  if (keys.length) return Math.max(...keys)
  return courseMax[course.value] || 1
})

const loadDefaults = (force = false) => {
  // 0) 路由切换课时时，标题随 step 变动（由 subtitle 计算属性已处理）

  // 1) 优先使用路由传入的示例代码（仅在首次或强制时覆盖）
  const q: any = route.query || {}
  const passedCode: string | undefined = q.code as any
  const passedLang: string | undefined = q.lang as any

  // 2) 使用内置模板作为基线
  let def = defaults[course.value]?.[step.value]
  // 若当前步未配置，回退到第 1 课模板
  if (!def) {
    def = defaults[course.value]?.[1]
  }
  if (def) {
    // 先填充模板
    if (force || !html.value) html.value = def.html
    if (force || !css.value) css.value = def.css
    if (force || !js.value) js.value = def.js

    // 再用传入示例覆盖对应语言（仅当传入匹配 lang）
    if (passedCode) {
      if (passedLang === 'css') css.value = passedCode
      else if (passedLang === 'javascript' || passedLang === 'jsx' || passedLang === 'tsx' || passedLang === 'typescript') js.value = passedCode
      else html.value = passedCode
    }
    // 同步到编辑器
    htmlEditor && htmlEditor.setValue(html.value)
    cssEditor && cssEditor.setValue(css.value)
    jsEditor && jsEditor.setValue(js.value)
  } else if (force) {
    // 最小兜底模板
    html.value = '<h1>新练习</h1>'
    css.value = ''
    js.value = ''
    htmlEditor && htmlEditor.setValue(html.value)
    cssEditor && cssEditor.setValue(css.value)
    jsEditor && jsEditor.setValue(js.value)
  }
}

const run = () => {
  // srcdoc 已绑定，不需要手动刷新。保持函数用于显式触发
  const el = iframeRef.value
  if (el) {
    // 触发重绘
    const sd = srcdoc.value
    el.srcdoc = sd
  }
}

const resetAll = () => {
  html.value = ''
  css.value = ''
  js.value = ''
  loadDefaults()
  run()
}

onMounted(() => {
  loadDefaults()
  run()
  initMonaco()
  showHints.value = false
})

// 路由步数变化时，强制载入对应模板
import { watch } from 'vue'
watch(step, () => {
  loadDefaults(true)
  run()
})

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function initMonaco() {
  // 加载 AMD loader
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js')
  // @ts-ignore
  const requireAny = (window as any).require
  requireAny.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } })
  await new Promise<void>((resolve) => requireAny(['vs/editor/editor.main'], () => resolve()))
  const monaco = (window as any).monaco

  if (htmlHost.value) {
    htmlEditor = monaco.editor.create(htmlHost.value, {
      value: html.value,
      language: 'html',
      automaticLayout: true,
      theme: 'vs',
      minimap: { enabled: false }
    })
    htmlEditor.onDidChangeModelContent(() => { html.value = htmlEditor.getValue(); run() })
  }
  if (cssHost.value) {
    cssEditor = monaco.editor.create(cssHost.value, {
      value: css.value,
      language: 'css',
      automaticLayout: true,
      theme: 'vs',
      minimap: { enabled: false }
    })
    cssEditor.onDidChangeModelContent(() => { css.value = cssEditor.getValue(); run() })
  }
  if (jsHost.value) {
    jsEditor = monaco.editor.create(jsHost.value, {
      value: js.value,
      language: 'javascript',
      automaticLayout: true,
      theme: 'vs',
      minimap: { enabled: false }
    })
    jsEditor.onDidChangeModelContent(() => { js.value = jsEditor.getValue(); run() })
  }
}

function goBack() {
  router.push(`/learn/${course.value}`)
}

function goNext() {
  const next = Math.max(1, step.value + 1)
  const q: any = { ...route.query }
  if (course.value === 'html') q.title = htmlTitles[next] || q.title || '实时编辑与预览'
  router.push({ name: 'exercise', params: { course: course.value, step: next }, query: q })
}

function goPrev() {
  const prev = Math.max(1, step.value - 1)
  const q: any = { ...route.query }
  if (course.value === 'html') q.title = htmlTitles[prev] || q.title || '实时编辑与预览'
  router.push({ name: 'exercise', params: { course: course.value, step: prev }, query: q })
}

async function formatCode() {
  try {
    await ensurePrettier()
    const prettier: any = (window as any).prettier
    const plugins: any = (window as any).prettierPlugins || {}
    if (activeTab.value === 'html') {
      html.value = prettier.format(html.value, { parser: 'html', plugins: [plugins.html] })
      htmlEditor && htmlEditor.setValue(html.value)
    } else if (activeTab.value === 'css') {
      css.value = prettier.format(css.value, { parser: 'css', plugins: [plugins.postcss] })
      cssEditor && cssEditor.setValue(css.value)
    } else {
      js.value = prettier.format(js.value, { parser: 'babel', plugins: [plugins.babel] })
      jsEditor && jsEditor.setValue(js.value)
    }
  } catch (e) {
    // 静默失败
  }
}

// 提示展开/收起
const showHints = ref(false)
function toggleHints() { showHints.value = !showHints.value }

async function ensurePrettier() {
  const w: any = window as any
  if (w.prettier && w.prettierPlugins) return
  // 使用 jsDelivr CDN 注入全局 prettier 与插件
  await loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/standalone.js')
  await Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/html.js'),
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/babel.js'),
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/postcss.js')
  ])
  // 标准化插件命名（有些 CDN 暴露为 prettierPlugins.html 等）
  w.prettierPlugins = w.prettierPlugins || {}
  w.prettierPlugins.html = w.prettierPlugins.html || w.prettierPlugins['prettierPlugins.html'] || w.prettierPlugins[0]
  w.prettierPlugins.babel = w.prettierPlugins.babel || w.prettierPlugins['prettierPlugins.babel'] || w.prettierPlugins[1]
  w.prettierPlugins.postcss = w.prettierPlugins.postcss || w.prettierPlugins['prettierPlugins.postcss'] || w.prettierPlugins[2]
}
</script>

<style scoped>
.exercise-page { display: flex; flex-direction: column; height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--el-border-color); }
.page-header .left { display: flex; align-items: baseline; gap: 12px; }
.page-header h1 { margin: 0; font-size: 18px; color: var(--el-text-color-primary); }
.page-header .desc { color: var(--el-text-color-secondary); font-size: 13px; }
.main { flex: 1; display: grid; grid-template-columns: 1fr 320px; overflow: hidden; }
.editor { display: grid; grid-template-rows: auto 1fr 1fr; overflow: hidden; border-right: 1px solid var(--el-border-color); }
.editor-toolbar { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--el-border-color); }
.editor-tabs { padding: 0; overflow: hidden; height: 100%; }
:deep(.el-tabs__nav-scroll) { padding-left: 26px; }
:deep(.el-tabs) { height: 100%; display: flex; flex-direction: column; }
:deep(.el-tabs__content) { flex: 1; height: 100%; overflow: hidden; }
:deep(.el-tab-pane) { height: 100%; }
.editor-host { height: 100%; }
.preview { border-top: 1px solid var(--el-border-color); overflow: hidden; }
.preview iframe { width: 100%; height: 100%; border: none; background: var(--el-bg-color); }
.sidebar { display: grid; grid-template-rows: auto 1fr; overflow: hidden; }
.hints { padding: 12px; border-bottom: 1px solid var(--el-border-color); }
.hints-header { display:flex; align-items:center; justify-content: space-between; }
.hints h3 { margin: 0 0 8px 0; font-size: 14px; color: var(--el-text-color-primary); }
.list { margin: 0; padding-left: 18px; color: var(--el-text-color-secondary); }
.assistant { overflow: auto; padding: 12px; }
</style>

