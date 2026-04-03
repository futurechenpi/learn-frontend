<!--
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-09-30 10:00:06
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2026-04-04 01:21:53
 * @FilePath: \learn-frontend\src\views\learn\TailwindCSS.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <CourseLesson :config="tailwindcssConfig" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { tailwindcssConfig } from './courseConfig'
</script>
