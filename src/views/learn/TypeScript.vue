<template>
  <CourseLesson :config="tsConfig" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { tsConfig } from './courseConfig'
</script>
