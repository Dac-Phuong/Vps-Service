<template>
  <UiFlex type="col border border-gray-200 dark:border-gray-800 rounded-lg p-4 max-w-3xl mx-auto">
    <UiIcon size="16" color="primary" name="i-bx-data"></UiIcon>
    <UiText size="sm" color="gray">{{ title || 'Không có dữ liệu' }}</UiText>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['title'])
</script>