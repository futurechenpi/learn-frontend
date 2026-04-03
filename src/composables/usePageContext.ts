/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2026-04-03 23:49:27
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2026-04-03 23:49:31
 * @FilePath: \learn-frontend\src\composables\usePageContext.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue'

export interface PageContext {
  pageName: string
  routeName: string
  lessonTitle: string
  lessonStep?: number
  lessonTotalSteps?: number
  contentSummary: string
  codeExample?: string
}

const context = ref<PageContext | null>(null)

export function usePageContext() {
  const setContext = (ctx: Partial<PageContext>) => {
    context.value = { ...context.value, ...ctx } as PageContext
  }

  const clearContext = () => {
    context.value = null
  }

  const getContext = () => context.value

  return {
    context,
    setContext,
    clearContext,
    getContext,
  }
}
