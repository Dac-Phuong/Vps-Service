<template>
  <div>
    <!-- Banner -->
    <LayoutDefaultBanner class="mb-4" />
    <UContainer class="p-2 overflow-hidden">
      <!--Product-->
      <ServiceProduct />
    </UContainer>
    <!-- Content -->
    <ServiceContentUpgrade />
    <!-- Features -->
    <ServiceContentFeatures />
    <!-- News -->
    <!-- <UContainer class="mb-2">
      <ServiceNewsList title="TIN TỨC NỔI BẬT" />
    </UContainer> -->
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