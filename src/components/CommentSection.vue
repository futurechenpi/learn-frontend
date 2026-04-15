<template>
  <div class="comment-section">
    <!-- 头部 -->
    <div class="comment-header">
      <div class="header-left">
        <span class="header-icon">💬</span>
        <h4>课程评论</h4>
        <span class="comment-badge">{{ comments.length }}</span>
      </div>
    </div>

    <!-- 评论输入区 -->
    <div v-if="userStore.isLoggedIn" class="comment-input-card">
      <div class="input-row">
        <div class="input-avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="" />
          <div v-else class="avatar-fallback">{{ (userStore.userInfo?.userName || '?')[0] }}</div>
        </div>
        <div class="input-body">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="2"
            :maxlength="500"
            show-word-limit
            placeholder="分享你的学习心得..."
            resize="none"
            class="comment-textarea"
          />
          <div class="input-actions">
            <el-button
              type="primary"
              round
              size="small"
              :loading="submitting"
              :disabled="!newComment.trim()"
              @click="handleSubmit"
            >
              <span class="btn-icon">✨</span>
              发表评论
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="login-tip-card">
      <span class="tip-icon">🔒</span>
      <div class="tip-text">
        <p>登录后即可参与评论互动</p>
      </div>
      <el-button type="primary" size="small" round @click="$router.push('/login')">去登录</el-button>
    </div>

    <!-- 空状态 -->
    <div v-if="comments.length === 0 && !loading" class="empty-state">
      <span class="empty-icon">📭</span>
      <p>暂无评论，快来发表第一条吧！</p>
    </div>

    <!-- 评论列表 -->
    <div v-loading="loading" class="comment-list">
      <transition-group name="comment-fade" tag="div" class="list-inner">
        <div v-for="(comment, index) in comments" :key="comment.id" class="comment-card" :style="{ animationDelay: index * 0.05 + 's' }">
          <div class="card-avatar">
            <img
              v-if="avatarUrlMap[comment.userId]"
              :src="avatarUrlMap[comment.userId]"
              alt=""
            />
            <div v-else class="avatar-placeholder">
              {{ (comment.userName || '?')[0].toUpperCase() }}
            </div>
          </div>
          <div class="card-body">
            <div class="card-top">
              <span class="card-name">{{ comment.userName }}</span>
              <span class="card-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
            <p class="card-content">{{ comment.content }}</p>
            <div class="card-actions">
              <span
                v-if="canDelete(comment)"
                class="action-delete"
                @click="handleDelete(comment)"
              >
                🗑️ 删除
              </span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getCommentList, addComment, deleteComment } from '@/api/comment'
import { getAvatarUrl, getAvatarSignedUrl, getAvatarProxyUrl } from '@/api/user'
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
const avatarUrl = ref<string>('')

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
          const r: any = await getAvatarUrl(c.userId)
          if (r?.data) avatarUrlMap.value[c.userId] = getAvatarProxyUrl(c.userId)
        } catch {}
      }
    }
    if (userStore.isLoggedIn && userStore.userInfo?.userId) {
      try {
        const r: any = await getAvatarUrl(userStore.userInfo.userId)
        if (r?.data) avatarUrl.value = getAvatarProxyUrl(userStore.userInfo.userId)
      } catch {}
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
  margin-top: 32px;
}

/* 头部 */
.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 20px;
}

.comment-header h4 {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark .comment-header h4 { color: #f1f5f9; }

.comment-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 11px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

/* 输入卡片 */
.comment-input-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.comment-input-card:focus-within {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.dark .comment-input-card {
  background: #1a1a2e;
  border-color: #2d2d44;
}

.input-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.input-avatar {
  flex-shrink: 0;
}

.input-avatar img,
.avatar-fallback {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 15px;
  font-weight: 600;
}

.input-body {
  flex: 1;
  min-width: 0;
}

.comment-textarea :deep(.el-textarea__inner) {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13.5px;
  line-height: 1.6;
  color: #374151;
  transition: all 0.2s;
  resize: none !important;
}

.comment-textarea :deep(.el-textarea__inner):focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}

.comment-textarea :deep(.el-textarea__inner)::placeholder {
  color: #b0b5c3;
}

.dark .comment-textarea :deep(.el-textarea__inner) {
  background: #12122a;
  border-color: #333355;
  color: #d1d5db;
}

.dark .comment-textarea :deep(.el-textarea__inner)::placeholder {
  color: #555;
}

.comment-textarea :deep(.el-input__count) {
  color: #9ca3af;
  font-size: 11px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.input-actions .el-button {
  padding: 8px 20px;
  font-weight: 600;
  font-size: 13px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
}

.input-actions .el-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-icon {
  margin-right: 4px;
}

/* 登录提示卡片 */
.login-tip-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fefce8, #fffbeb);
  border: 1px solid #fde68a;
  border-radius: 12px;
  margin-bottom: 20px;
}

.dark .login-tip-card {
  background: rgba(234,179,8,0.06);
  border-color: rgba(234,179,8,0.2);
}

.tip-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.tip-text p {
  margin: 0;
  font-size: 13.5px;
  color: #92400e;
  flex: 1;
}

.dark .tip-text p {
  color: #fcd34d;
}

.login-tip-card .el-button {
  font-weight: 600;
  flex-shrink: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  color: #9ca3af;
}

/* 评论列表 */
.comment-list {
  min-height: 40px;
}

.list-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 评论卡片 */
.comment-card {
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  transition: all 0.25s ease;
  animation: slideIn 0.35s ease both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comment-card:hover {
  border-color: #e0e0e0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.dark .comment-card {
  background: #16162b;
  border-color: #252540;
}

.dark .comment-card:hover {
  border-color: #33335a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.card-avatar {
  flex-shrink: 0;
}

.card-avatar img,
.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: 600;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.card-name {
  font-weight: 600;
  font-size: 13.5px;
  color: #1f2937;
}

.dark .card-name { color: #e2e8f0; }

.card-time {
  font-size: 11.5px;
  color: #9ca3af;
}

.card-content {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: #4b5563;
  word-break: break-word;
}

.dark .card-content { color: #c4c9d4; }

.card-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.action-delete {
  cursor: pointer;
  font-size: 12px;
  color: #b0b5c3;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

.dark .action-delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* 过渡动画 */
.comment-fade-enter-active,
.comment-fade-leave-active {
  transition: all 0.3s ease;
}
.comment-fade-enter-from,
.comment-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
