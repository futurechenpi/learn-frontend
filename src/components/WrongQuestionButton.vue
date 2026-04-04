<template>
  <el-popover ref="popoverRef" placement="bottom-end" :width="320" trigger="click">
    <template #reference>
      <el-button :type="added ? 'warning' : 'danger'" size="small">
        {{ added ? '✓ 已入错题本' : '📌 加入错题本' }}
      </el-button>
    </template>
    <div class="wrong-question-form">
      <h4>📌 收藏到错题本</h4>
      <p class="form-hint">记录当前题目，方便之后重做复习</p>
      <el-input
        v-model="note"
        type="textarea"
        :rows="3"
        placeholder="记下你的思路或遇到的问题（可选）..."
        resize="vertical"
      />
      <div class="form-actions">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="small" :loading="saving" @click="handleAdd">确认添加</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { addWrongQuestion, getWrongQuestions } from '@/api/wrongQuestion'

const props = defineProps<{
  courseKey: string
  lessonStep?: number
  lessonTitle?: string
  currentCode?: string
}>()

const userStore = useUserStore()
const note = ref('')
const saving = ref(false)
const added = ref(false)
const popoverRef = ref()

function handleCancel() {
  note.value = ''
  popoverRef.value?.hide?.()
}

async function handleAdd() {
  if (!userStore.userInfo?.userId) return
  saving.value = true
  try {
    const wrongCode = props.currentCode || ''
    const res: any = await getWrongQuestions(userStore.userInfo.userId)
    const existing = (res?.data || []).find((item: any) => {
      const keyMatch = String(item.courseKey || '') === String(props.courseKey || '')
      const stepMatch = (item.lessonStep ?? null) == (props.lessonStep ?? null)
      return keyMatch && stepMatch
    })
    if (existing) {
      ElMessage.warning('该题目已在错题本中')
      popoverRef.value?.hide?.()
      saving.value = false
      return
    }
    await addWrongQuestion({
      courseKey: props.courseKey,
      lessonStep: props.lessonStep,
      lessonTitle: props.lessonTitle,
      wrongCode,
      note: note.value || undefined
    })
    added.value = true
    ElMessage.success('已加入错题本')
    popoverRef.value?.hide?.()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '操作失败')
  }
  saving.value = false
}
</script>

<style scoped>
.wrong-question-form h4 {
  margin: 0 0 6px 0;
  font-size: 15px;
}
.form-hint {
  font-size: 12px;
  color: #909399;
  margin: 0 0 12px 0;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
</style>
