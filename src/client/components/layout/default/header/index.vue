<template>
  <UiFlex class="ju
    sticky top-0
    bg-white/75 dark:bg-transparent
    backdrop-blur-xl
    shadow-sm dark:shadow-xl
    h-[var(--layout-default-header-size)] max-h-[var(--layout-default-header-size)]
    px-5
  ">
    <!-- Logo -->
    <LayoutDefaultNavToggle class="mr-1" />
    <NuxtLink to="/">
      <UiLogo class="hidden mr-4 md:flex min-w-[160px]" />
    </NuxtLink>
    <!-- Nav Toogle -->
    <UHorizontalNavigation class="hidden md:flex justify-center" :links="links" />
    <UiFlex class="ml-auto">
      <!-- Auth -->
      <Auth />
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const links = [
  {
    label: 'Cửa hàng',
    to: '/shop',
  },
  {
    label: 'Tin tức',
    to: '/news',
  },
  {
    label: 'Giỏ hàng',
    to: '/cart',
  },
  {
    label: 'Dịch vụ',
    to: '/service',
  }]
</script>