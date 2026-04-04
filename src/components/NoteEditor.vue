<template>
  <div class="note-section">
    <div class="note-header">
      <h4>📝 我的笔记</h4>
      <el-button type="primary" size="small" @click="showEditor = true; editingNote = null; noteForm.content = ''; noteForm.title = ''">
        + 新建笔记
      </el-button>
    </div>

    <div v-if="notes.length === 0 && !loading" class="note-empty">
      <p>还没有笔记，快来记录学习心得吧~</p>
    </div>

    <div v-loading="loading" class="note-list">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <div class="note-card-header">
          <span class="note-title">{{ note.title }}</span>
          <span class="note-time">{{ formatTime(note.updatedAt) }}</span>
        </div>
        <p class="note-preview">{{ note.content.slice(0, 120) }}{{ note.content.length > 120 ? '...' : '' }}</p>
        <div class="note-actions">
          <el-button size="small" text type="primary" @click="openEdit(note)">编辑</el-button>
          <el-button size="small" text type="danger" @click="handleDelete(note)">删除</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showEditor"
      :title="editingNote ? '编辑笔记' : '新建笔记'"
      width="640px"
      :close-on-click-modal="false"
    >
      <el-form label-width="60px">
        <el-form-item label="标题">
          <el-input v-model="noteForm.title" placeholder="给笔记起个标题（可选）" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="noteForm.content"
            type="textarea"
            :rows="10"
            placeholder="在这里记录你的学习笔记，支持 Markdown 格式..."
            resize="vertical"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditor = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getNotes, addNote, updateNote, deleteNote } from '@/api/note'
import type { NoteItem } from '@/api/note'

const props = defineProps<{ courseKey: string }>()

const userStore = useUserStore()
const notes = ref<NoteItem[]>([])
const loading = ref(false)
const saving = ref(false)
const showEditor = ref(false)
const editingNote = ref<NoteItem | null>(null)

const noteForm = reactive({
  title: '',
  content: ''
})

function formatTime(time: string) {
  const d = new Date(time)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function loadNotes() {
  loading.value = true
  try {
    const res: any = await getNotes(userStore.userInfo!.userId, props.courseKey)
    notes.value = res?.data || []
  } catch {}
  loading.value = false
}

function openEdit(note: NoteItem) {
  editingNote.value = note
  noteForm.title = note.title
  noteForm.content = note.content
  showEditor.value = true
}

async function handleSubmit() {
  if (!noteForm.content.trim()) {
    ElMessage.warning('请输入笔记内容')
    return
  }
  saving.value = true
  try {
    if (editingNote.value) {
      await updateNote(editingNote.value.id, { title: noteForm.title || undefined, content: noteForm.content })
      ElMessage.success('笔记已更新')
    } else {
      await addNote({
        courseKey: props.courseKey,
        title: noteForm.title || undefined,
        content: noteForm.content
      })
      ElMessage.success('笔记已保存')
    }
    showEditor.value = false
    loadNotes()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '操作失败')
  }
  saving.value = false
}

async function handleDelete(note: NoteItem) {
  await ElMessageBox.confirm('确定删除这条笔记吗？', '提示', { type: 'warning' })
  try {
    await deleteNote(note.id)
    ElMessage.success('已删除')
    loadNotes()
  } catch {}
}

onMounted(loadNotes)

defineExpose({ refresh: loadNotes })
</script>

<style scoped>
.note-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
.dark .note-section { border-top-color: #444; }

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.note-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
.dark .note-header h4 { color: #e5e7eb; }

.note-empty { text-align: center; padding: 24px; color: #9ca3af; font-size: 0.9rem; }

.note-list { display: flex; flex-direction: column; gap: 12px; }

.note-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px 16px;
  transition: background 0.2s;
}
.dark .note-card { background: #1f2937; border-color: #374151; }
.note-card:hover { background: #f3f4f6; }
.dark .note-card:hover { background: #293241; }

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.note-title { font-weight: 600; font-size: 0.92rem; color: #374151; }
.dark .note-title { color: #d1d5db; }
.note-time { font-size: 0.78rem; color: #9ca3af; }

.note-preview {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  word-break: break-word;
}
.dark .note-preview { color: #d1d5db; }

.note-actions { display: flex; gap: 4px; }
</style>
