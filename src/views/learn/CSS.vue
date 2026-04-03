<template>
  <CourseLesson :config="cssConfig" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { cssConfig } from './courseConfig'
</script>
