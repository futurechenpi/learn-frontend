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
  // 处理多个答案的情况（用 | 分隔）
  const userAnswerList = userAnswer.split('|').map(ans => ans.trim().toLowerCase())
  const normalizedCorrectAnswers = correctAnswers.map(ans => ans.trim().toLowerCase())

  // 检查每个用户答案是否都在正确答案列表中
  const allCorrect = userAnswerList.every(userAns =>
    userAns === '' || normalizedCorrectAnswers.some(correctAns => correctAns === userAns)
  )

  // 检查是否有空答案
  const hasEmptyAnswer = userAnswerList.some(ans => ans === '')

  const isCorrect = allCorrect && !hasEmptyAnswer

  return {
    score: isCorrect ? 100 : 0,
    feedback: isCorrect ? '答案正确！' : `正确答案应该是: ${correctAnswers.join(' 和 ')}`
  }
}

