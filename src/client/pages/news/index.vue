<template>
  <UContainer class="p-2">
    <UBreadcrumb class="mb-3 mt-2" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Tin tức' }]" />
    <ServiceNewsList />
  </UContainer>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => "Tin tức - ENI",
  ogTitle: () => "Tin tức - ENI",
})
</script>