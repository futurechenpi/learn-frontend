<template>
  <div class="exercise-page">
    <header class="page-header">
      <div class="left">
        <el-button text @click="goBack"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        <h1>实战练习 · {{ config.pageName.split(' ')[0] }}</h1>
        <span class="desc">第 {{ step }} 课 · {{ subtitle }}</span>
      </div>
      <div class="right">
        <WrongQuestionButton :course-key="config.courseKey" :lesson-step="step" :lesson-title="subtitle" />
        <el-button type="primary" @click="goPrev" :disabled="step <= 1">上一课</el-button>
        <el-button type="primary" @click="goNext" :disabled="step >= maxStep">下一课</el-button>
      </div>
    </header>

    <main class="main">
      <div class="workspace">
        <div class="preview-panel">
          <div class="preview-row">
            <div class="preview-half">
              <div class="panel-header">
                <span class="panel-title">🎯 目标效果</span>
              </div>
              <iframe :srcdoc="goalSrcdoc" class="goal-iframe" />
            </div>
            <div class="preview-half">
              <div class="panel-header">
                <span class="panel-title">📝 你的效果</span>
              </div>
              <iframe :srcdoc="userSrcdoc" class="user-iframe" />
            </div>
          </div>
        </div>

        <div class="editor-panel">
          <div class="editor-toolbar">
            <el-radio-group v-model="activeTab" size="small" class="tab-group">
              <el-radio-button v-if="config.tabs.includes('html')" value="html">{{ tabLabel('html') }}</el-radio-button>
              <el-radio-button v-if="config.tabs.includes('css')" value="css">{{ tabLabel('css') }}</el-radio-button>
              <el-radio-button v-if="config.tabs.includes('js')" value="js">{{ tabLabel('js') }}</el-radio-button>
            </el-radio-group>
            <div class="tools">
              <el-button size="small" :type="answerShown[activeTab] ? 'warning' : 'default'" @click="toggleAnswer">{{ answerShown[activeTab] ? '🙈 隐藏答案' : '💡 显示答案' }}</el-button>
              <el-button size="small" type="danger" @click="clearCode">清空代码</el-button>
            </div>
          </div>
          <div class="editor-body" ref="editorBodyRef">
            <div v-show="activeTab === 'html'" class="editor-host" ref="htmlHost"></div>
            <div v-show="activeTab === 'css'" class="editor-host" ref="cssHost"></div>
            <div v-show="activeTab === 'js'" class="editor-host" ref="jsHost"></div>
          </div>
        </div>
      </div>

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
import { ref, computed, reactive, onMounted, watch, nextTick, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import AIAssistant from '@/components/AIAssistant.vue'
import WrongQuestionButton from '@/components/WrongQuestionButton.vue'
import { saveUserProgress } from '@/api/progress'
import { usePageContext } from '@/composables/usePageContext'
import { useUserStore } from '@/stores/user'
import type { ExerciseConfig, ExerciseTab } from './exerciseConfig'

const props = defineProps<{ config: ExerciseConfig }>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { setContext } = usePageContext()

const DEFAULT_LABELS: Record<ExerciseTab, string> = { html: 'HTML', css: 'CSS', js: 'JavaScript' }

const step = computed(() => Number(route.params.step || 1))
const subtitle = computed(() => String(route.query.title || '开始练习'))
const activeTab = ref<ExerciseTab>(props.config.defaultTab)
const html = ref('')
const css = ref('')
const js = ref('')
const htmlHost = ref<HTMLElement>()
const cssHost = ref<HTMLElement>()
const jsHost = ref<HTMLElement>()
const editorBodyRef = ref<HTMLElement>()
let editors: Record<string, any> = {}
let monacoInstance: any = null
const showHints = ref(false)
const answerShown = reactive<Record<ExerciseTab, boolean>>({ html: false, css: false, js: false })

function tabLabel(tab: ExerciseTab): string {
  return props.config.tabLabels?.[tab] || DEFAULT_LABELS[tab]
}

const maxStep = computed(() => {
  const keys = Object.keys(props.config.lessons).map(Number).filter(n => !Number.isNaN(n))
  return keys.length ? Math.max(...keys) : 1
})

const hints = computed(() => props.config.lessons[step.value]?.hints || [])

function getPrimary() {
  return getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary') || '#3b82f6'
}

function isDarkMode() {
  return document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

function editorLanguage(tab: ExerciseTab): string {
  if (tab === 'css') return 'css'
  if (tab === 'js') {
    if (props.config.courseKey === 'typescript') return 'typescript'
    if (props.config.courseKey === 'react') return 'typescript'
    return 'javascript'
  }
  return 'html'
}

function escapeHtmlContent(raw: string): string {
  return raw.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')
}

const goalSrcdoc = computed(() => {
  const lesson = props.config.lessons[step.value] || props.config.lessons[1]
  if (!lesson) return ''
  const h = escapeHtmlContent(lesson.html || '')
  const c = escapeHtmlContent(lesson.css || '')
  const j = escapeHtmlContent(lesson.js || '')
  const cdn = props.config.frameworkCdn || ''
  const primary = getPrimary()
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>' + c + '\n:root{--el-color-primary:' + primary + '}</style>' + cdn + '</head><body>' + h + '<script>try{' + j + '}catch(e){console.error(e)}<\/script></body></html>'
})

const userSrcdoc = computed(() => {
  const h = escapeHtmlContent(html.value)
  const c = escapeHtmlContent(css.value)
  const j = escapeHtmlContent(js.value)
  const primary = getPrimary()
  let body = h
  const cdn = props.config.frameworkCdn || ''
  const headStyle = '<style>' + c + '\n:root{--el-color-primary:' + primary + '}</style>'
  if (!props.config.tabs.includes('html')) body = '<div class="exercise-body">' + h + '</div>'
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"/>' + headStyle + cdn + '</head><body>' + body + '<script>try{' + j + '}catch(e){console.error(e)}<\/script></body></html>'
})

const updatePageContext = () => {
  const lessonData = props.config.lessons[step.value] || props.config.lessons[1]
  const title = props.config.titles[step.value] || subtitle.value
  const goalHtml = lessonData?.html || ''
  const goalCss = lessonData?.css || ''
  const goalJs = lessonData?.js || ''
  setContext({
    pageName: props.config.pageContextName,
    routeName: props.config.routeName,
    lessonTitle: title,
    lessonStep: step.value,
    lessonTotalSteps: maxStep.value,
    contentSummary: `练习目标：${title}\n提示：${(lessonData?.hints || []).join('；')}`,
    codeExample: [
      '【目标 HTML】\n' + goalHtml,
      '【目标 CSS】\n' + goalCss,
      '【目标 JS】\n' + goalJs,
      '【你当前写的 HTML】\n' + html.value,
      '【你当前写的 CSS】\n' + css.value,
      '【你当前写的 JS】\n' + js.value,
    ].join('\n\n'),
  })
}

watch(step, () => { loadLesson(); updatePageContext() })
watchEffect(() => {
  if (html.value || css.value || js.value) {
    updatePageContext()
  }
})

function loadLesson() {
  html.value = ''
  css.value = ''
  js.value = ''
  answerShown.html = false
  answerShown.css = false
  answerShown.js = false
  Object.values(editors).forEach((ed: any) => { ed?.setValue('') })
}

onMounted(async () => {
  loadLesson()
  await nextTick()
  await initMonaco()
  updatePageContext()
})

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function initMonaco() {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js')
    // @ts-ignore
    const req = (window as any).require
    req.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } })
    await new Promise<void>(r => req(['vs/editor/editor.main'], () => r()))
    monacoInstance = (window as any).monaco

    const theme = isDarkMode() ? 'vs-dark' : 'vs'

    const createEditor = (host: HTMLElement | undefined, tab: ExerciseTab, key: string) => {
      if (!host || !monacoInstance) return null
      const ed = monacoInstance.editor.create(host, {
        value: '',
        language: editorLanguage(tab),
        theme,
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
        fontLigatures: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        renderWhitespace: 'selection',
        bracketPairColorization: { enabled: true },
        guides: { indentation: true, bracketPairs: true },
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          quickSuggestions: true,
        },
        padding: { top: 12, bottom: 12 }
      })
      ed.onDidChangeModelContent(() => {
        const val = ed.getValue()
        if (key === 'html') html.value = val
        else if (key === 'css') css.value = val
        else if (key === 'js') js.value = val
      })
      return ed
    }

    if (props.config.tabs.includes('html')) editors.html = createEditor(htmlHost.value, 'html', 'html')
    if (props.config.tabs.includes('css')) editors.css = createEditor(cssHost.value, 'css', 'css')
    if (props.config.tabs.includes('js')) editors.js = createEditor(jsHost.value, 'js', 'js')

    Object.values(editors).forEach((ed: any) => { ed?.layout() })
  } catch (e) {
    console.error('Monaco Editor 初始化失败:', e)
  }
}

function goBack() { router.push(props.config.backRoute) }
function goNext() {
  const n = Math.max(1, step.value + 1)
  if (userStore.isLoggedIn && userStore.userInfo?.userId) {
    saveUserProgress({ userId: userStore.userInfo.userId, course: props.config.progressKey, step: n }).catch(() => {})
  }
  router.push({ name: props.config.routeName, params: { step: n }, query: { title: props.config.titles[n] || '' } })
}
function goPrev() {
  const p = Math.max(1, step.value - 1)
  if (userStore.isLoggedIn && userStore.userInfo?.userId) {
    saveUserProgress({ userId: userStore.userInfo.userId, course: props.config.progressKey, step: p }).catch(() => {})
  }
  router.push({ name: props.config.routeName, params: { step: p }, query: { title: props.config.titles[p] || '' } })
}

function clearCode() {
  const currentEd = editors[activeTab.value]
  if (currentEd) currentEd.setValue('')
  answerShown[activeTab.value] = false
}

function toggleAnswer() {
  const tab = activeTab.value
  if (answerShown[tab]) {
    answerShown[tab] = false
    clearCode()
    return
  }
  const lesson = props.config.lessons[step.value] || props.config.lessons[1]
  if (!lesson) return
  if (tab === 'html' && editors.html) {
    editors.html.setValue(lesson.html || '')
  } else if (tab === 'css' && editors.css) {
    editors.css.setValue(lesson.css || '')
  } else if (tab === 'js' && editors.js) {
    editors.js.setValue(lesson.js || '')
  }
  answerShown[tab] = true
}

function toggleHints() { showHints.value = !showHints.value }
</script>

<style scoped>
.exercise-page { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.page-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--el-border-color); flex-shrink: 0; }
.page-header .left { display: flex; align-items: baseline; gap: 12px; }
.page-header h1 { margin: 0; font-size: 18px; color: var(--el-text-color-primary); }
.page-header .desc { color: var(--el-text-color-secondary); font-size: 13px; }
.main { flex: 1; display: grid; grid-template-columns: 1fr 320px; overflow: hidden; min-height: 0; }
.workspace { display: grid; grid-template-columns: minmax(280px, 40%) 1fr; overflow: hidden; border-right: 1px solid var(--el-border-color); min-width: 0; }

.preview-panel { display: flex; flex-direction: column; background: #fafbfc; overflow: hidden; border-right: 1px solid var(--el-border-color); }
.dark .preview-panel { background: #111827; }
.preview-row { flex: 1; display: grid; grid-template-rows: 1fr 1fr; overflow: hidden; gap: 1px; background: var(--el-border-color); }
.preview-half { display: flex; flex-direction: column; background: white; overflow: hidden; min-height: 0; }
.dark .preview-half { background: #1a1a2e; }
.panel-header { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--el-border-color); flex-shrink: 0; }
.panel-title { font-size: 13px; font-weight: 600; color: var(--el-text-color-primary); white-space: nowrap; }
.preview-iframe-wrap { flex: 1; overflow: hidden; position: relative; min-height: 0; }
.goal-iframe, .user-iframe { width: 100%; height: 100%; border: none; background: white; flex: 1; }
.dark .goal-iframe, .dark .user-iframe { background: #1a1a2e; }

.editor-panel { display: flex; flex-direction: column; overflow: hidden; min-width: 0; min-height: 0; }
.editor-toolbar { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--el-border-color); flex-shrink: 0; }
.tab-group { flex: 1; }
.tab-group :deep(.el-radio-button__inner) { padding: 4px 12px; font-size: 12px; }
.tools { display: flex; align-items: center; margin-left: auto; flex-shrink: 0; }

.editor-body { flex: 1; position: relative; overflow: hidden; min-height: 0; }
.editor-host {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sidebar { display: flex; flex-direction: column; overflow: hidden; }
.hints { padding: 12px; border-bottom: 1px solid var(--el-border-color); flex-shrink: 0; }
.hints-header { display: flex; align-items: center; justify-content: space-between; }
.hints h3 { margin: 0 0 8px 0; font-size: 14px; color: var(--el-text-color-primary); }
.list { margin: 0; padding-left: 18px; color: var(--el-text-color-secondary); font-size: 13px; }
.assistant { flex: 1; overflow: auto; padding: 12px; }
</style>
