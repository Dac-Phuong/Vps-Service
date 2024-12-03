<template>
  <UContainer class="p-2">
    <UBreadcrumb class="mb-5" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Đơn hàng' }]" />
    <ServiceOrderHistory/>
  </UContainer>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: () => "Đơn hàng - ENI",
  ogTitle: () => "Đơn hàng - ENI"
})
 const authStore = useAuthStore()
</script>
