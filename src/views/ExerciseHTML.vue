<template>
  <div class="exercise-page">
    <header class="page-header">
      <div class="left">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>实战练习 · HTML</h1>
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
        <div class="assistant">
          <AIAssistant />
        </div>
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
import { useUserStore } from '@/stores/user'
import { saveUserProgress } from '@/api/progress'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const step = computed(() => Number(route.params.step || 1))
const subtitle = computed(() => String(route.query.title || '实时编辑与预览'))
// 引入集中式课程与标题（仅 html）
import { htmlLessons, htmlTitles } from '@/views/learn/lessons'

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

const srcdoc = computed(() => {
  return `<!DOCTYPE html><html><head><style>${css.value}\n:root{--el-color-primary:${getPrimary()}}\n</style></head><body>${html.value}<script>try{${js.value}}catch(e){console.error(e)}</` + `script></body></html>`
})

function getPrimary() {
  return getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary') || '#3b82f6'
}

const hints = computed(() => htmlLessons[step.value]?.hints || htmlLessons[1]?.hints || [])

const maxStep = computed(() => {
  const keys = Object.keys(htmlLessons).map(k => Number(k)).filter(n => !Number.isNaN(n))
  return keys.length ? Math.max(...keys) : 1
})

const loadDefaults = (force = false) => {
  // 0) 路由切换课时时，标题随 step 变动（由 subtitle 计算属性已处理）

  // 1) 优先使用路由传入的示例代码（仅在首次或强制时覆盖）
  const q: any = route.query || {}
  const passedCode: string | undefined = q.code as any
  const passedLang: string | undefined = q.lang as any

  // 2) 使用集中式模板作为基线
  let def = htmlLessons[step.value]
  // 若当前步未配置，回退到第 1 课模板
  if (!def) def = htmlLessons[1]
  if (def) {
    // 先填充模板
    if (force || !html.value) html.value = def.html
    if (force || !css.value) css.value = def.css
    if (force || !js.value) js.value = def.js

    // 再用传入示例覆盖对应语言（仅当传入匹配 lang）
    if (passedCode) {

      if (passedLang === 'css') {
        css.value = passedCode
      } else if (passedLang === 'javascript' || passedLang === 'jsx' || passedLang === 'tsx' || passedLang === 'typescript') {
        js.value = passedCode
      } else if (passedLang === 'html') {
        // 仅当明确为 html 时才覆盖，避免路由携带的旧 code 影响后续课时
        html.value = passedCode
      }
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

function goBack() { router.push('/learn/html') }

function goNext() {
  const n = Math.max(1, step.value + 1)
  if (userStore.isLoggedIn && userStore.userInfo?.userId) {
    saveUserProgress({ userId: userStore.userInfo.userId, course: 'html', step: n }).catch(()=>{})
  }
  router.push({ name: 'exercise-html', params: { step: n }, query: { title: htmlTitles[n] || '实时编辑与预览' } })
}

function goPrev() {
  const p = Math.max(1, step.value - 1)
  if (userStore.isLoggedIn && userStore.userInfo?.userId) {
    saveUserProgress({ userId: userStore.userInfo.userId, course: 'html', step: p }).catch(()=>{})
  }
  router.push({ name: 'exercise-html', params: { step: p }, query: { title: htmlTitles[p] || '实时编辑与预览' } })
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

