<template>
  <div class="comment-section">
    <div class="comment-header">
      <h4>💬 课程评论</h4>
      <span class="comment-count">{{ comments.length }} 条评论</span>
    </div>

    <div v-if="userStore.isLoggedIn" class="comment-input-area">
      <el-input
        v-model="newComment"
        type="textarea"
        :rows="2"
        :maxlength="500"
        show-word-limit
        placeholder="写下你对这门课程的看法..."
        resize="none"
      />
      <div class="comment-input-actions">
        <el-button
          type="primary"
          size="small"
          :loading="submitting"
          :disabled="!newComment.trim()"
          @click="handleSubmit"
        >
          发表评论
        </el-button>
      </div>
    </div>
    <div v-else class="comment-login-tip">
      <p>登录后即可参与评论~</p>
      <el-button size="small" @click="$router.push('/login')">去登录</el-button>
    </div>

    <div v-if="comments.length === 0 && !loading" class="comment-empty">
      <p>暂无评论，快来发表第一条吧！</p>
    </div>

    <div v-loading="loading" class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          <img
            v-if="avatarUrlMap[comment.userId]"
            :src="avatarUrlMap[comment.userId]"
            alt=""
          />
          <div v-else class="avatar-placeholder">
            {{ (comment.userName || '?')[0].toUpperCase() }}
          </div>
        </div>
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-username">{{ comment.userName }}</span>
            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
          <div
            v-if="canDelete(comment)"
            class="comment-delete"
            @click="handleDelete(comment)"
          >
            删除
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getCommentList, addComment, deleteComment } from '@/api/comment'
import { getAvatarSignedUrl } from '@/api/user'
import type { CommentItem } from '@/api/comment'

const props = defineProps<{
  courseKey: string
}>()

const userStore = useUserStore()
const comments = ref<CommentItem[]>([])
const newComment = ref('')
const submitting = ref(false)
const loading = ref(false)
const avatarUrlMap = ref<Record<number, string>>({})

function formatTime(time: string) {
  const d = new Date(time)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}小时前`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}天前`
  return d.toLocaleDateString('zh-CN')
}

function canDelete(comment: CommentItem): boolean {
  return userStore.isLoggedIn && userStore.userInfo?.userId === comment.userId
}

async function loadComments() {
  loading.value = true
  try {
    const res: any = await getCommentList(props.courseKey)
    comments.value = res?.data || []
    avatarUrlMap.value = {}
    for (const c of comments.value) {
      if (c.userId && !avatarUrlMap.value[c.userId]) {
        try {
          const signed: any = await getAvatarSignedUrl(c.userId)
          if (signed?.data) avatarUrlMap.value[c.userId] = signed.data
        } catch {}
      }
    }
  } catch {}
  loading.value = false
}

async function handleSubmit() {
  const content = newComment.value.trim()
  if (!content) return
  submitting.value = true
  try {
    await addComment(props.courseKey, content)
    ElMessage.success('评论成功')
    newComment.value = ''
    loadComments()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '评论失败')
  }
  submitting.value = false
}

async function handleDelete(comment: CommentItem) {
  await ElMessageBox.confirm('确定删除这条评论吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消' })
  try {
    await deleteComment(comment.id)
    ElMessage.success('已删除')
    loadComments()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(loadComments)

defineExpose({ refresh: loadComments })
</script>

<style scoped>
.comment-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.dark .comment-section { border-top-color: #444; }

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.comment-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}
.dark .comment-header h4 { color: #e5e7eb; }
.comment-count {
  font-size: 0.85rem;
  color: #9ca3af;
}

.comment-input-area {
  margin-bottom: 16px;
}
.comment-input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.comment-login-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 12px;
}
.dark .comment-login-tip { background: #1f2937; }
.comment-login-tip p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.comment-empty {
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 0.9rem;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
}
.comment-item:hover { background: #f9fafb; }
.dark .comment-item:hover { background: #1f2937; }

.comment-avatar {
  flex-shrink: 0;
}
.comment-avatar img,
.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.comment-body {
  flex: 1;
  min-width: 0;
}
.comment-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.comment-username {
  font-weight: 500;
  font-size: 0.9rem;
  color: #374151;
}
.dark .comment-username { color: #d1d5db; }
.comment-time {
  font-size: 0.8rem;
  color: #9ca3af;
}
.comment-content {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
  word-break: break-word;
}
.dark .comment-content { color: #d1d5db; }

.comment-delete {
  cursor: pointer;
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 6px;
  display: inline-block;
}
.comment-delete:hover { color: #ef4444; }
</style>
