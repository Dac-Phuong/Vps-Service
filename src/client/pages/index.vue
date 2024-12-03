<template>
  <div>
    <!-- Banner -->
    <LayoutDefaultBanner class="mb-4" />
    <UContainer class="p-2">
      <!--Product-->
      <ServiceProduct title="Gói dịch vụ" />
    </UContainer>
    <!-- content -->
    <ServiceContentSetting />
    <!--  -->
    <ServiceContentFeatures />
  </div>
</template>

<script setup>
useSeoMeta({
  title: () => "Trang chủ - ENI",
  ogTitle: () => "Trang chủ - ENI",
})
</script>