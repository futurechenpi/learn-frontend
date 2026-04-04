/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2026-04-05 01:28:16
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2026-04-05 03:33:11
 */
export type ExerciseTab = 'html' | 'css' | 'js'

export interface ExerciseConfig {
  courseKey: string
  pageName: string
  routeName: string
  backRoute: string
  progressKey: string
  tabs: ExerciseTab[]
  defaultTab: ExerciseTab
  tabLabels?: Partial<Record<ExerciseTab, string>>
  pageContextName: string
  lessons: Record<number, any>
  titles: Record<number, string>
}

import { htmlLessons, htmlTitles } from './lessons'
import { cssLessons, cssTitles } from './lessons'
import { jsLessons, jsTitles } from './lessons'

export const htmlExerciseConfig: ExerciseConfig = {
  courseKey: 'html',
  pageName: 'HTML 实战练习',
  routeName: 'exercise-html',
  backRoute: '/learn/html',
  progressKey: 'html',
  tabs: ['html', 'css', 'js'],
  defaultTab: 'html',
  pageContextName: 'HTML 实战练习',
  lessons: htmlLessons,
  titles: htmlTitles
}

export const cssExerciseConfig: ExerciseConfig = {
  courseKey: 'css',
  pageName: 'CSS 实战练习',
  routeName: 'exercise-css',
  backRoute: '/learn/css',
  progressKey: 'css',
  tabs: ['html', 'css'],
  defaultTab: 'css',
  pageContextName: 'CSS 实战练习',
  lessons: cssLessons,
  titles: cssTitles
}

export const jsExerciseConfig: ExerciseConfig = {
  courseKey: 'javascript',
  pageName: 'JavaScript 实战练习',
  routeName: 'exercise-js',
  backRoute: '/learn/javascript',
  progressKey: 'javascript',
  tabs: ['html', 'js'],
  defaultTab: 'js',
  pageContextName: 'JavaScript 实战练习',
  lessons: jsLessons,
  titles: jsTitles
}
