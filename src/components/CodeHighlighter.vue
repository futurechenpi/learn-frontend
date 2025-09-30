<template>
  <div class="code-highlighter">
    <div class="code-header" v-if="showHeader">
      <div class="code-title">
        <el-icon><Document /></el-icon>
        <span>{{ title || language }}</span>
      </div>
      <div class="code-actions">
        <el-button 
          size="small" 
          text 
          @click="copyCode"
          class="copy-btn"
        >
          <el-icon><CopyDocument /></el-icon>
          复制
        </el-button>
      </div>
    </div>
    <div class="code-content" ref="codeContainer">
      <pre><code :class="`language-${language}`" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, CopyDocument } from '@element-plus/icons-vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'

interface Props {
  code: string
  language?: string
  title?: string
  showHeader?: boolean
  showLineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  showHeader: true,
  showLineNumbers: true
})

const codeContainer = ref<HTMLElement>()

const highlightedCode = computed(() => {
  if (!props.code) return ''
  
  try {
    // 处理HTML语言映射
    const languageMap: Record<string, string> = {
      'html': 'markup',
      'xml': 'markup',
      'svg': 'markup'
    }
    
    const actualLanguage = languageMap[props.language] || props.language
    const grammar = Prism.languages[actualLanguage] || Prism.languages.javascript
    
    const highlighted = Prism.highlight(
      props.code, 
      grammar,
      actualLanguage
    )
    return highlighted
  } catch (error) {
    console.warn('Syntax highlighting failed:', error)
    return props.code
  }
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    ElMessage.success('代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

onMounted(() => {
  nextTick(() => {
    if (props.showLineNumbers && codeContainer.value) {
      codeContainer.value.classList.add('line-numbers')
    }
  })
})
</script>

<style scoped>
.code-highlighter {
  background: #2d3748;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 16px 0;
}

.dark .code-highlighter {
  background: #1a202c;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #4a5568;
  border-bottom: 1px solid #718096;
}

.dark .code-header {
  background: #2d3748;
  border-bottom: 1px solid #4a5568;
}

.code-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
}

.copy-btn {
  color: #e2e8f0;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.code-content {
  position: relative;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  padding: 20px;
  background: transparent;
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
  overflow-x: auto;
}

.code-content code {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

/* 语法高亮样式覆盖 */
:deep(.token.comment),
:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) {
  color: #6a9955;
  font-style: italic;
}

:deep(.token.punctuation) {
  color: #d4d4d4;
}

:deep(.token.property),
:deep(.token.tag),
:deep(.token.boolean),
:deep(.token.number),
:deep(.token.constant),
:deep(.token.symbol),
:deep(.token.deleted) {
  color: #b5cea8;
}

:deep(.token.selector),
:deep(.token.attr-name),
:deep(.token.string),
:deep(.token.char),
:deep(.token.builtin),
:deep(.token.inserted) {
  color: #ce9178;
}

:deep(.token.operator),
:deep(.token.entity),
:deep(.token.url),
:deep(.language-css .token.string),
:deep(.style .token.string) {
  color: #d4d4d4;
}

:deep(.token.atrule),
:deep(.token.attr-value),
:deep(.token.keyword) {
  color: #569cd6;
}

:deep(.token.function),
:deep(.token.class-name) {
  color: #dcdcaa;
}

:deep(.token.regex),
:deep(.token.important),
:deep(.token.variable) {
  color: #d16969;
}

/* 行号样式 */
:deep(.line-numbers .line-numbers-rows) {
  border-right: 1px solid #4a5568;
  padding-right: 16px;
  margin-right: 16px;
}

:deep(.line-numbers-rows > span:before) {
  color: #718096;
  font-size: 12px;
}

/* 滚动条样式 */
.code-content::-webkit-scrollbar {
  height: 8px;
}

.code-content::-webkit-scrollbar-track {
  background: #2d3748;
}

.code-content::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
