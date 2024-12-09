<template>
  <div>
    <!-- Banner -->
    <LayoutDefaultBanner class="mb-4" />
    <!--Product-->
    <UContainer class="overflow-hidden">
      <ServiceProduct />
    </UContainer>
    <!-- Content -->
    <ServiceContentUpgrade />
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