<template>
  <UCard v-if="product" class="BoxProducts shadow-lg relative flex flex-col h-full" :ui="{
    body: { padding: 'p-0 sm:p-0' },
    background: 'bg-gray-50 dark:bg-gray-800',
    footer: {}
  }">
    <div class="bg-primary">
      <UiText class="line-clamp-1 text-white px-3 text-center pt-2 lg:text-lg md:text-md text-sm">
        {{ product.name }}
      </UiText>
      <UiText weight="semibold" class="text-white line-clamp-1 px-3 pb-2 text-center">
        {{ useMoney().toMoney(product.price) }}/ Tháng
      </UiText>
    </div>
    <div class="flex-1 flex flex-col px-3 py-2 mb-[100px]">
      <UiFlex class="gap-1 my-1 py-1 border-b border-gray-200 dark:border-gray-600" v-for="item in product.specs"
        :key="item._id">
        <UiText class="min-w-[70px] pb-1" weight="semibold" size="base">
          {{ item.key }} :
        </UiText>
        <UiText class="ml-2 line-clamp-1" size="base">
          {{ item.value }}
        </UiText>
      </UiFlex>
    </div>
    <div class="absolute bottom-0 w-full px-3 py-2">
      <USelectMenu v-model="state" :options="product.options" option-attribute="number"
        class="border mt-2 border-gray-200 dark:border-gray-600 rounded-lg">
        <template #option="{ option }">
          <span class="truncate">
            {{ option?.number }} tháng - {{ useMoney().toMoney(option?.price) }}₫
          </span>
        </template>
        <template #label="{ selected }">
          <span class="truncate">
            {{ selected ? `${selected?.number} tháng - ${useMoney().toMoney(selected?.price)}` : "Giá thuê / Tháng" }}
          </span>
        </template>
      </USelectMenu>
      <UButton v-if="!!authStore.isLogin" color="primary" size="md" @click="open(product.key)"
        class="w-full flex items-center rounded-lg my-2 justify-center">
        Đăng ký ngay
      </UButton>
      <UButton v-else color="primary" size="md" @click="authStore.setModal(true)"
        class="w-full flex items-center rounded-lg my-2 justify-center">
        Đăng ký ngay
      </UButton>
    </div>
  </UCard>

</template>

<script setup>
const props = defineProps(["product"]);
const authStore = useAuthStore()
const state = ref(null)
const open = async (key) => {
  await navigateTo(`/product/${key}`)
}
</script>

<style lang="sass">
.BoxProducts
  transition: all 0.25s ease
  &:hover
    transform: scale(1.03)
    border: 1px solid rgb(var(--color-primary-DEFAULT))
    box-shadow: 0 0 15px rgb(var(--color-primary-DEFAULT))
    transform-origin: center center
</style>
