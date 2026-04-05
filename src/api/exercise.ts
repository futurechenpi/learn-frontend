/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2026-04-01 14:17:45
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2026-04-01 16:20:42
 * @FilePath: \learn-frontend\src\api\exercise.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'

export interface ExerciseQuestion {
  question: string
  answer: string[]
  explanation: string
  full_code: string
  skeleton_code: string
  key_points: string[]
}

export async function generateQuestion(topic: string, difficulty: string = 'medium'): Promise<ExerciseQuestion> {
  const res = await axios.post('/api/exercise/generate', { topic, difficulty })
  return res.data.data
}

export async function gradeAnswer(question: string, userAnswer: string, correctAnswers: string[]): Promise<{ score: number; feedback: string }> {
  const userAnswerList = userAnswer.split('|').map(ans => ans.trim().toLowerCase()).filter(ans => ans !== '')
  const normalizedCorrectAnswers = correctAnswers.map(ans => ans.trim().toLowerCase())

  if (userAnswerList.length === 0) {
    return { score: 0, feedback: '请输入至少一个答案' }
  }

  let correctCount = 0
  const details: string[] = []

  for (let i = 0; i < userAnswerList.length; i++) {
    const userAns = userAnswerList[i]
    const isMatch = normalizedCorrectAnswers.some(correctAns =>
      userAns === correctAns || normalizeText(userAns) === normalizeText(correctAns)
    )
    if (isMatch) {
      correctCount++
      details.push(`✓ 答案 ${i + 1} 正确`)
    } else {
      const closestMatch = findClosestMatch(userAns, normalizedCorrectAnswers)
      details.push(`✗ 答案 ${i + 1} 错误${closestMatch ? ` (接近: ${closestMatch})` : ''}`)
    }
  }

  const totalToMatch = Math.max(userAnswerList.length, normalizedCorrectAnswers.length)
  const score = Math.round((correctCount / totalToMatch) * 100)

  let feedback = ''
  if (score === 100) {
    feedback = '🎉 完美！所有答案都正确！'
  } else if (score >= 70) {
    feedback = `👍 做得不错！答对 ${correctCount}/${totalToMatch} 个答案 (${score}分)\n\n详情：\n${details.join('\n')}\n\n参考答案：${normalizedCorrectAnswers.join(' / ')}`
  } else if (score > 0) {
    feedback = `💪 继续努力！答对 ${correctCount}/${totalToMatch} 个答案 (${score}分)\n\n详情：\n${details.join('\n')}\n\n参考答案：${normalizedCorrectAnswers.join(' / ')}`
  } else {
    feedback = `❌ 需要再复习一下哦 (0分)\n\n详情：\n${details.join('\n')}\n\n参考答案：${normalizedCorrectAnswers.join(' / ')}`
  }

  return { score, feedback }
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, '').replace(/[；;，,。.]/g, ',').toLowerCase()
}

function findClosestMatch(userAns: string, correctAnswers: string[]): string | null {
  let bestMatch = ''
  let bestScore = 0.5

  for (const correct of correctAnswers) {
    const similarity = calculateSimilarity(userAns, correct)
    if (similarity > bestScore) {
      bestScore = similarity
      bestMatch = correct
    }
  }

  return bestScore > 0.5 ? bestMatch : null
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1)
  const s2 = normalizeText(str2)
  if (s1 === s2) return 1
  if (s1.includes(s2) || s2.includes(s1)) return 0.8

  const longer = Math.max(s1.length, s2.length)
  if (longer === 0) return 1

  const editDistance = getEditDistance(s1, s2)
  return 1 - editDistance / longer
}

function getEditDistance(s1: string, s2: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= s2.length; i++) matrix[i] = [i]
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = [j]

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2[i - 1] === s1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[s2.length][s1.length]
}

