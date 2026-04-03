<template>
  <CourseLesson :config="reactConfig" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { reactConfig } from './courseConfig'
</script>
