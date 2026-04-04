<!--
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-10-01 18:59:09
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2026-04-05 01:34:44
 * @FilePath: \learn-frontend\src\views\ExerciseJS.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template><ExerciseTemplate :config="jsExerciseConfig" /></template>
<script setup lang="ts">
import ExerciseTemplate from './learn/ExerciseTemplate.vue'
import { jsExerciseConfig } from './learn/exerciseConfig'
</script>
