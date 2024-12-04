<template>
  <div>
    <!-- Banner -->
    <LayoutDefaultBanner class="mb-4" />
    <UContainer class="p-2 overflow-hidden">
      <!--Product-->
      <ServiceProduct />
    </UContainer>
    <!-- Content -->
    <ServiceContentSetting />
    <!-- Features -->
    <ServiceContentFeatures />
    <!-- Questions -->
    <ServiceContentQuestions />
  </div>
</template>

<script setup>
useSeoMeta({
  title: () => "Trang chủ - ENI",
  ogTitle: () => "Trang chủ - ENI",
})
</script>