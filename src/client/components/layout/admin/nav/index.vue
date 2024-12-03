<template>
  <div>
    <UButton block size="md" class="mb-2" @click="navigateTo('/')">Trang Chủ</UButton>

    <UAccordion :items="navItems" :ui="{
      'item': { padding: 'pt-0 pb-2 pl-6' },
    }" multiple>
      <template #default="{ item, open }">
        <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
          <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'" />
          <UiText class="mx-4" size="sm" weight="semibold" :color="open ? 'primary' : 'gray'" :text="item.label" />
          <UiIcon name="i-bx-chevron-right" size="5" :color="open ? 'primary' : 'gray'"
            class="ms-auto transform transition-transform duration-200" :class="[open && 'rotate-90']" />
        </UiFlex>
      </template>
      <template #tab-0>
        <UVerticalNavigation :links="navItems[0].children" @click="emit('to')" />
      </template>
      <template #tab-1>
        <UVerticalNavigation :links="navItems[1].children" @click="emit('to')" />
      </template>
      <template #tab-2>
        <UVerticalNavigation :links="navItems[2].children" @click="emit('to')" />
      </template>
      <template #tab-3>
        <UVerticalNavigation :links="navItems[3].children" @click="emit('to')" />
      </template>
      <template #tab-4>
        <UVerticalNavigation :links="navItems[4].children" @click="emit('to')" />
      </template>
      <template #tab-5>
        <UVerticalNavigation :links="navItems[5].children" @click="emit('to')" />
      </template>
    </UAccordion>
  </div>
</template>

<script setup>
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: true,
    slot: 'tab-0',
    children: [
      { label: 'Thống kê', to: '/admin/statistic' },
      { label: 'Kênh thanh toán', to: '/admin/gate' },
      { label: 'Đơn hàng', to: '/admin/order' },
      { label: 'Cài đặt', to: '/admin/config' },
    ]
  },
  {
    label: 'Tin tức',
    icon: 'i-bx-news',
    defaultOpen: true,
    slot: 'tab-1',
    children: [
      { label: 'Danh mục', to: '/admin/news/category' },
      { label: 'Danh sách', to: '/admin/news' },
    ]
  },
  {
    label: 'Sản phẩm',
    icon: 'i-bx-package',
    defaultOpen: true,
    slot: 'tab-2',
    children: [
      { label: 'Danh mục', to: '/admin/product/category' },
      { label: 'Danh sách', to: '/admin/product' },
    ]
  },
  {
    label: 'Tài khoản',
    icon: 'i-bx-user',
    defaultOpen: true,
    slot: 'tab-3',
    children: [
      { label: 'Dịch vụ', to: '/admin/service' },
      { label: 'Danh sách', to: '/admin/user' },
    ]
  },
  {
    label: 'Hệ điều hành',
    icon: 'eos-icons:system-group',
    defaultOpen: true,
    slot: 'tab-4',
    children: [
      { label: 'Danh sách', to: '/admin/os' },
    ]
  },
  {
    label: 'Nhật ký',
    icon: 'i-bx-history',
    defaultOpen: true,
    slot: 'tab-5',
    children: [
      { label: 'Admin log', to: '/admin/logs' },
    ]
  },
]
</script>