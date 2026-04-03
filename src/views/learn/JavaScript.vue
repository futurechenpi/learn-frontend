<template>
  <CourseLesson :config="jsConfig" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { jsConfig } from './courseConfig'
</script>
