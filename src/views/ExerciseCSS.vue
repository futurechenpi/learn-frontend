<template>
  <div class="exercise-page">
    <header class="page-header">
      <div class="left">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>实战练习 · CSS</h1>
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
const activeTab = ref<'html' | 'css'>('html')
const html = ref('')
const css = ref('')
const htmlHost = ref<HTMLElement>()
const cssHost = ref<HTMLElement>()
let htmlEditor: any
let cssEditor: any
const iframeRef = ref<HTMLIFrameElement>()

const lessons: Record<number, { html: string; css: string; hints: string[] }> = {
  1: {
    html: `<div class="card">卡片</div>`,
    css: `.card{padding:16px;border:1px solid #ccc;border-radius:8px;background:#f8fafc}`,
    hints: ['编写一个类选择器 .card', '为其添加 padding 与边框', '设置圆角与背景色']
  },
  2: {
    html: `<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>`,
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

const maxStep = computed(() => Math.max(...Object.keys(lessons).map(n => Number(n))))

const srcdoc = computed(() => `<!DOCTYPE html><html><head><style>${css.value}\n:root{--el-color-primary:${getPrimary()}}</style></head><body>${html.value}</body></html>`)
function getPrimary(){
  return getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary') || '#3b82f6'
}

const hints = computed(() => lessons[step.value]?.hints || [])

// 标题映射，确保上一课/下一课时小标题同步
const cssTitles: Record<number, string> = {
  1: 'CSS 基础语法',
  2: '选择器详解',
  3: '盒模型和布局',
  4: '响应式设计'
}

function loadLesson(){
  const l = lessons[step.value] || lessons[1]
  html.value = l.html
  // 若路由传入 code 与 lang=css，则覆盖 css 初值
  const q: any = route.query || {}
  const passedCode = (q.code as string) || ''
  css.value = q.lang === 'css' && passedCode ? passedCode : l.css
  htmlEditor && htmlEditor.setValue(html.value)
  cssEditor && cssEditor.setValue(css.value)
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
  if ((q.lang as string) === 'css') activeTab.value = 'css'
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
  if (cssHost.value) {
    cssEditor = monaco.editor.create(cssHost.value, { value: css.value, language:'css', automaticLayout:true, theme:'vs', minimap:{enabled:false} })
    cssEditor.onDidChangeModelContent(() => { css.value = cssEditor.getValue(); run() })
  }
}

function goBack(){ router.push('/learn/css') }
function goNext(){
  const n = Math.max(1, step.value+1)
  router.push({ name:'exercise-css', params:{ step:n }, query:{ title: cssTitles[n] || '实时编辑与预览' } })
}
function goPrev(){
  const p = Math.max(1, step.value-1)
  router.push({ name:'exercise-css', params:{ step:p }, query:{ title: cssTitles[p] || '实时编辑与预览' } })
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
      css.value = prettier.format(css.value, { parser: 'css', plugins: [plugins.postcss] })
      cssEditor && cssEditor.setValue(css.value)
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
    loadScript('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/postcss.js')
  ])
  w.prettierPlugins = w.prettierPlugins || {}
  w.prettierPlugins.html = w.prettierPlugins.html || w.prettierPlugins[0]
  w.prettierPlugins.postcss = w.prettierPlugins.postcss || w.prettierPlugins[1]
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


