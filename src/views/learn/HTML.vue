<!--
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-09-30 09:55:09
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2026-04-04 00:00:00
 * @FilePath: \learn-frontend\src\views\learn\HTML.vue
-->
<template>
  <CourseLesson :config="htmlConfig" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { htmlConfig } from './courseConfig'
</script>
