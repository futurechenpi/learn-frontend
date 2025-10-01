<template>
  <div class="exercise-page">
    <header class="page-header">
      <div class="left">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>实战练习 · JavaScript</h1>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import AIAssistant from '@/components/AIAssistant.vue'

const route = useRoute()
const router = useRouter()
const step = computed(() => Number(route.params.step || 1))
const subtitle = computed(() => String(route.query.title || '实时编辑与预览'))
const activeTab = ref<'html' | 'js'>('html')
const html = ref('')
const js = ref('')
const htmlHost = ref<HTMLElement>()
const jsHost = ref<HTMLElement>()
let htmlEditor: any
let jsEditor: any
const iframeRef = ref<HTMLIFrameElement>()

const lessons: Record<number, { html: string; js: string; hints: string[] }> = {
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

const maxStep = computed(() => Math.max(...Object.keys(lessons).map(n => Number(n))))

const srcdoc = computed(() => `<!DOCTYPE html><html><head><style>:root{--el-color-primary:${getPrimary()}}</style></head><body>${html.value}<script>try{${js.value}}catch(e){console.error(e)}</` + `script></body></html>`)
function getPrimary(){
  return getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary') || '#3b82f6'
}

const hints = computed(() => lessons[step.value]?.hints || [])

// 标题映射，确保上一课/下一课时小标题同步
const jsTitles: Record<number, string> = {
  1: 'JavaScript 基础语法',
  2: '函数和作用域',
  3: '对象和数组',
  4: 'DOM操作',
  5: '异步编程'
}

function loadLesson(){
  const l = lessons[step.value] || lessons[1]
  html.value = l.html
  // 若路由传入 code 与 lang=javascript，则覆盖 js 初值
  const q: any = route.query || {}
  const passedCode = (q.code as string) || ''
  js.value = q.lang === 'javascript' && passedCode ? passedCode : l.js
  htmlEditor && htmlEditor.setValue(html.value)
  jsEditor && jsEditor.setValue(js.value)
}

function run(){
  const el = iframeRef.value
  if (el) el.srcdoc = srcdoc.value
}

function resetAll(){
  loadLesson()
  run()
}

onMounted(() => {
  // 根据入口语言切换默认激活的编辑器页签
  const q: any = route.query || {}
  if ((q.lang as string) === 'javascript') activeTab.value = 'js'
  loadLesson()
  run()
  initMonaco()
})

watch(step, () => { loadLesson(); run() })

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function initMonaco(){
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js')
  // @ts-ignore
  const requireAny = (window as any).require
  requireAny.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } })
  await new Promise<void>((resolve) => requireAny(['vs/editor/editor.main'], () => resolve()))
  const monaco = (window as any).monaco

  if (htmlHost.value) {
    htmlEditor = monaco.editor.create(htmlHost.value, { value: html.value, language:'html', automaticLayout:true, theme:'vs', minimap:{enabled:false} })
    htmlEditor.onDidChangeModelContent(() => { html.value = htmlEditor.getValue(); run() })
  }
  if (jsHost.value) {
    jsEditor = monaco.editor.create(jsHost.value, { value: js.value, language:'javascript', automaticLayout:true, theme:'vs', minimap:{enabled:false} })
    jsEditor.onDidChangeModelContent(() => { js.value = jsEditor.getValue(); run() })
  }
}

function goBack(){ router.push('/learn/javascript') }
function goNext(){
  const n = Math.max(1, step.value+1)
  router.push({ name:'exercise-js', params:{ step:n }, query:{ title: jsTitles[n] || '实时编辑与预览' } })
}
function goPrev(){
  const p = Math.max(1, step.value-1)
  router.push({ name:'exercise-js', params:{ step:p }, query:{ title: jsTitles[p] || '实时编辑与预览' } })
}

async function formatCode(){
  try {
    await ensurePrettier()
    const prettier: any = (window as any).prettier
    const plugins: any = (window as any).prettierPlugins || {}
    if (activeTab.value === 'html') {
      html.value = prettier.format(html.value, { parser: 'html', plugins: [plugins.html] })
      htmlEditor && htmlEditor.setValue(html.value)
    } else {
      js.value = prettier.format(js.value, { parser: 'babel', plugins: [plugins.babel] })
      jsEditor && jsEditor.setValue(js.value)
    }
  } catch {}
}

function toggleHints(){ showHints.value = !showHints.value }
const showHints = ref(false)

async function ensurePrettier(){
  const w: any = window as any
  if (w.prettier && w.prettierPlugins) return
  await loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/standalone.js')
  await Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/html.js'),
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/babel.js')
  ])
  w.prettierPlugins = w.prettierPlugins || {}
  w.prettierPlugins.html = w.prettierPlugins.html || w.prettierPlugins[0]
  w.prettierPlugins.babel = w.prettierPlugins.babel || w.prettierPlugins[1]
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
/* Element Plus 结构为 header > nav-wrap > nav-scroll，此处对 wrap 设置内边距更稳妥 */
.editor-tabs :deep(.el-tabs__nav-wrap) { padding-left: 26px !important; }
/* 兼容写法 */
.editor-tabs ::v-deep(.el-tabs__nav-wrap) { padding-left: 26px !important; }
::deep(.el-tabs) { height: 100%; display: flex; flex-direction: column; }
::deep(.el-tabs__content) { flex: 1; height: 100%; overflow: hidden; }
::deep(.el-tab-pane) { height: 100%; }
.editor-host { height: 100%; }
.editor, .editor-tabs, :deep(.el-tabs), :deep(.el-tabs__content), :deep(.el-tab-pane), .editor-host { min-height: 0; }
/* 兼容写法，确保作用于不同构建器 */
::v-deep(.el-tabs) { height: 100%; display: flex; flex-direction: column; }
::v-deep(.el-tabs__content) { flex: 1; height: 100%; overflow: hidden; }
::v-deep(.el-tab-pane) { height: 100%; }
.preview { border-top: 1px solid var(--el-border-color); overflow: hidden; }
.preview iframe { width: 100%; height: 100%; border: none; background: var(--el-bg-color); }
.sidebar { display: grid; grid-template-rows: auto 1fr; overflow: hidden; }
.hints { padding: 12px; border-bottom: 1px solid var(--el-border-color); }
.hints-header { display:flex; align-items:center; justify-content: space-between; }
.hints h3 { margin: 0 0 8px 0; font-size: 14px; color: var(--el-text-color-primary); }
.list { margin: 0; padding-left: 18px; color: var(--el-text-color-secondary); }
.assistant { overflow: auto; padding: 12px; }
</style>


