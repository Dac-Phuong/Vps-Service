<template>
  <UiFlex type="col" class="space-y-4 w-full">
    <UVerticalNavigation :links="links"/>
  </UiFlex>
</template>

<script setup>

const links = [{
  label: 'Trang chủ',
  icon: 'i-heroicons-home',
  to: '/'
},
{
  label: 'Cửa hàng',
  icon: 'material-symbols:store-outline',
  to: '/shop'
},
{
  label: 'Tin tức',
  icon: 'i-mdi-newspaper',
  to: '/news'
},
{
  label: 'Dịch vụ',
  icon: 'material-symbols:home-repair-service',
  to: '/service'
},
{
  label: 'Tài khoản',
  icon: 'i-bxs-user',
  to: '/account'
}]
</script>
<style lang="scss" scoped>
  nav {
    width: 100% !important;
  }
</style>