<template>
  <div class="achievement-panel">
    <div v-if="newlyUnlocked.length > 0" class="unlock-banner" @click="showUnlockDialog = true">
      🎉 恭喜解锁新成就！点击查看
    </div>

    <div class="achievement-grid">
      <div
        v-for="item in achievements"
        :key="item.id"
        class="achievement-badge"
        :class="{ unlocked: item.unlocked, locked: !item.unlocked }"
        :title="item.unlocked ? item.description : '未解锁'"
      >
        <div class="badge-icon">{{ item.unlocked ? item.icon : '🔒' }}</div>
        <div class="badge-name">{{ item.name }}</div>
        <div class="badge-desc">{{ item.description }}</div>
      </div>
    </div>

    <el-dialog v-model="showUnlockDialog" title="🎉 新成就解锁！" width="400px">
      <div class="unlock-list">
        <div v-for="ach in newlyUnlocked" :key="ach.id" class="unlock-item">
          <span class="unlock-icon">{{ ach.icon }}</span>
          <div class="unlock-info">
            <strong>{{ ach.name }}</strong>
            <p>{{ ach.description }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyAchievements, checkAchievements, type AchievementItem } from '@/api/achievement'
import { useUserStore } from '@/stores/user'

const props = defineProps<{ userId?: number }>()

const userStore = useUserStore()
const achievements = ref<AchievementItem[]>([])
const newlyUnlocked = ref<AchievementItem[]>([])
const showUnlockDialog = ref(false)

async function loadAchievements() {
  const uid = props.userId || userStore.userInfo?.userId
  if (!uid) return
  try {
    const res: any = await getMyAchievements(uid)
    achievements.value = res?.data || []
    const checkRes: any = await checkAchievements(uid)
    if (checkRes?.data && Array.isArray(checkRes.data) && checkRes.data.length > 0) {
      newlyUnlocked.value = checkRes.data
      showUnlockDialog.value = true
      loadAchievements()
    }
  } catch {}
}

onMounted(loadAchievements)

defineExpose({ refresh: loadAchievements })
</script>

<style scoped>
.achievement-panel { margin-top: 20px; }
.unlock-banner {
  background: rgba(251, 191, 36, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 10px;
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  color: #fef3c7;
  cursor: pointer;
  margin-bottom: 16px;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
.achievement-badge {
  text-align: center;
  padding: 16px 10px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s;
}
.achievement-badge.unlocked {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(134, 239, 172, 0.4);
}
.achievement-badge.locked {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  opacity: 0.55;
}
.badge-icon { font-size: 32px; margin-bottom: 6px; }
.badge-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}
.badge-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unlock-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: rgba(52, 211, 153, 0.12);
  border-radius: 10px;
  margin-bottom: 10px;
}
.unlock-icon { font-size: 36px; }
.unlock-info strong { color: #bbf7d0; display: block; margin-bottom: 2px; }
.unlock-info p { color: #a7f3d0; font-size: 13px; margin: 0; }
</style>
