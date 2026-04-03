<template>
  <CourseLesson :config="vue3Config" />
</template>

<script setup lang="ts">
import CourseLesson from './CourseLesson.vue'
import { vue3Config } from './courseConfig'
</script>
