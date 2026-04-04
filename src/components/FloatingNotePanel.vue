<template>
  <div class="floating-note-panel" :class="{ minimized: isMinimized, 'is-dark': isDark }">
    <div class="panel-tab" @click="toggleMinimize" v-if="isMinimized">
      <span class="tab-icon">📝</span>
      <span class="tab-text">笔记</span>
    </div>

    <template v-if="!isMinimized">
      <div class="panel-header">
        <span class="panel-title">📝 学习笔记</span>
        <div class="panel-actions">
          <el-button text size="small" @click="toggleMinimize" title="最小化">
            <el-icon><Minus /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="panel-body">
        <div v-if="!userStore.isLoggedIn" class="login-hint">
          <p>登录后可使用笔记功能</p>
          <el-button size="small" type="primary" @click="$router.push('/login')">去登录</el-button>
        </div>

        <template v-else>
          <div class="note-selector">
            <el-select
              v-model="selectedNoteId"
              placeholder="选择或新建笔记"
              size="small"
              style="flex: 1;"
              @change="onSelectNote"
            >
              <el-option
                v-for="n in notes"
                :key="n.id"
                :label="n.title || `笔记 ${notes.indexOf(n) + 1}`"
                :value="n.id"
              />
            </el-select>
            <el-button size="small" type="primary" @click="createNewNote">+ 新建</el-button>
          </div>

          <div class="note-editor-area">
            <el-input
              v-model="noteTitle"
              placeholder="标题（可选）"
              size="small"
              class="note-title-input"
            />
            <el-input
              v-model="noteContent"
              type="textarea"
              :rows="14"
              placeholder="在这里记录你的学习心得..."
              resize="none"
              class="note-content-input"
              @blur="autoSave"
            />
            <div class="editor-footer">
              <span class="save-hint">{{ saveStatus }}</span>
              <el-button size="small" type="primary" :loading="saving" @click="handleSave">保存</el-button>
            </div>
          </div>

          <div v-if="notes.length > 0" class="note-list-mini">
            <div class="list-header">我的笔记 ({{ notes.length }})</div>
            <div
              v-for="n in notes"
              :key="n.id"
              class="mini-note-item"
              :class="{ active: n.id === selectedNoteId }"
              @click="openNote(n)"
            >
              <span class="mini-title">{{ n.title || '无标题' }}</span>
              <el-icon
                class="delete-icon"
                color="#f56c6c"
                size="12"
                @click.stop="handleDelete(n)"
              ><Delete /></el-icon>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Minus, Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getNotes, addNote, updateNote, deleteNote } from '@/api/note'
import type { NoteItem } from '@/api/note'

const props = defineProps<{
  courseKey: string
  lessonStep?: number
  lessonTitle?: string
}>()

const STORAGE_KEY = 'floating-note-panel-minimized'

const userStore = useUserStore()
const isMinimized = ref(localStorage.getItem(STORAGE_KEY) !== 'false')
const isDark = ref(false)

const notes = ref<NoteItem[]>([])
const selectedNoteId = ref<number | null>(null)
const noteTitle = ref('')
const noteContent = ref('')
const saving = ref(false)
const saveStatus = ref('')

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
  localStorage.setItem(STORAGE_KEY, String(isMinimized.value))
}

function createNewNote() {
  selectedNoteId.value = null
  noteTitle.value = props.lessonTitle || ''
  noteContent.value = ''
  saveStatus.value = '新建笔记'
}

function openNote(note: NoteItem) {
  selectedNoteId.value = note.id
  noteTitle.value = note.title
  noteContent.value = note.content
  saveStatus.value = ''
}

function onSelectNote(id: number) {
  const note = notes.value.find(n => n.id === id)
  if (note) openNote(note)
}

async function loadNotes() {
  if (!userStore.userInfo?.userId) return
  try {
    const res: any = await getNotes(userStore.userInfo.userId, props.courseKey)
    notes.value = res?.data || []
    if (notes.value.length > 0 && !selectedNoteId.value) {
      openNote(notes.value[0])
    }
  } catch {}
}

async function handleSave() {
  if (!noteContent.value.trim()) {
    ElMessage.warning('请输入笔记内容')
    return
  }
  if (!userStore.userInfo?.userId) return
  saving.value = true
  try {
    if (selectedNoteId.value) {
      await updateNote(selectedNoteId.value, { title: noteTitle.value || undefined, content: noteContent.value })
      ElMessage.success('已保存')
    } else {
      const res: any = await addNote({
        courseKey: props.courseKey,
        lessonStep: props.lessonStep,
        title: noteTitle.value || undefined,
        content: noteContent.value
      })
      selectedNoteId.value = res.data?.id || null
      ElMessage.success('已保存')
    }
    saveStatus.value = '已保存 ' + new Date().toLocaleTimeString().slice(0, 5)
    loadNotes()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '保存失败')
  }
  saving.value = false
}

function autoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => {
    if (noteContent.value.trim()) handleSave()
  }, 2000)
}

async function handleDelete(note: NoteItem) {
  await ElMessageBox.confirm('确定删除这条笔记吗？', '提示', { type: 'warning' })
  try {
    await deleteNote(note.id)
    ElMessage.success('已删除')
    if (selectedNoteId.value === note.id) {
      createNewNote()
    }
    loadNotes()
  } catch {}
}

function checkDarkMode() {
  isDark.value = document.documentElement.classList.contains('dark')
}

watch(() => props.lessonStep, () => {
  if (props.lessonTitle) {
    noteTitle.value = props.lessonTitle
  }
})

onMounted(() => {
  checkDarkMode()
  const observer = new MutationObserver(checkDarkMode)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  onUnmounted(() => observer.disconnect())
  if (props.lessonTitle) {
    noteTitle.value = props.lessonTitle
  }
  loadNotes()
})

defineExpose({ refresh: loadNotes })
</script>

<style scoped>
.floating-note-panel {
  position: fixed;
  right: 16px;
  top: 80px;
  width: 320px;
  z-index: 999;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
}

.dark .floating-note-panel,
.floating-note-panel.is-dark {
  background: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.panel-tab {
  cursor: pointer;
  padding: 10px 18px;
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  user-select: none;
}
.is-dark .panel-tab {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}
.panel-tab:hover,
.is-dark .panel-tab:hover {
  border-color: #409eff !important;
  color: #409eff !important;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.minimized {
  width: auto;
  box-shadow: none;
  background: transparent;
  overflow: visible;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.dark .panel-header,
.is-dark .panel-header {
  border-bottom-color: #374151;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
.is-dark .panel-title { color: #e5e7eb; }

.panel-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.login-hint {
  text-align: center;
  padding: 20px 0;
  color: #9ca3af;
}
.login-hint p { margin-bottom: 12px; }

.note-selector {
  display: flex;
  gap: 6px;
  align-items: center;
}

.note-editor-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note-title-input :deep(.el-input__wrapper) {
  border-radius: 6px;
}

.note-content-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  min-height: 280px;
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.save-hint {
  font-size: 11px;
  color: #9ca3af;
}

.note-list-mini {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.is-dark .note-list-mini { border-top-color: #374151; }

.list-header {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 6px;
}

.mini-note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 6px;
}
.mini-note-item:hover {
  background: #f3f4f6;
}
.is-dark .mini-note-item:hover { background: #374151; }
.mini-note-item.active {
  background: #ede9fe;
  color: #6d28d9;
}
.is-dark .mini-note-item.active { background: rgba(124, 58, 237, 0.2); }

.mini-title {
  font-size: 12px;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.is-dark .mini-title { color: #d1d5db; }

.delete-icon {
  opacity: 0;
  transition: opacity 0.15s;
  cursor: pointer;
  flex-shrink: 0;
}
.mini-note-item:hover .delete-icon { opacity: 1; }
</style>
