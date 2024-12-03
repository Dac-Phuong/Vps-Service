<template>
  <UContainer class="p-2">
    <UBreadcrumb class="mb-3 mt-2" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản' }]" />
    <UiEmpty v-if="!authStore.isLogin" title='Bạn chưa đăng nhập' />
    <div v-else class="xl:col-span-10 col-span-2">
      <UTabs v-model="tab" :items="items" class="max-w-[500px]" />
      <ServiceUserEdit v-if="tab == 0" />
      <AuthSignForgot v-if="tab == 1" />
      <ServiceUserTax v-if="tab == 2" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: () => "Tài khoản - ENI",
  ogTitle: () => "Tài khoản - ENI"
})
const authStore = useAuthStore()
const tab = ref(0)
const items = [{
  label: 'Hồ sơ cá nhân'
}, {
  label: 'Bảo mật',
}, {
  label: 'Thông tin thuế'
}]
</script>

<style></style>