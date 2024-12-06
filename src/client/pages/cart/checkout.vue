<template>
  <UContainer class="p-2">
    <UBreadcrumb class="mb-3 mt-2" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Giỏ hàng', to: '/cart' }, { label: 'Thanh toán' }]" />
    <div v-if="!!cartStore.cart && cartStore.cart.length > 0" class="mt-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
        <div class="col-span-12 md:col-span-8 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <UiText text="Phương thức thanh toán" weight="semibold" size="base" class="mb-1" />
          <UiText text="Chọn phương thức thanh toán thuận tiện nhất cho bạn." size="sm" class="mb-5" />
          <div class="grid-cols-12 grid gap-2">
            <div v-for="(item, index) in list" :key="index" @click="getOption(item, index)"
              :class="['grid col-span-6 md:col-span-3 h-20 flex flex-col justify-center items-center rounded-lg border relative cursor-pointer', index === state.index ? 'border-primary' : 'border-gray-200 dark:border-gray-600']">
              <div class="absolute top-2 right-2">
                <UiIcon size="6" color="primary" name="iconamoon:check-bold" v-if="index === state.index" />
              </div>
              <div class="text-center">
                <UiText class="text-sm font-medium">{{ item.name }}</UiText>
              </div>
            </div>
          </div>
          <div v-if="state.gate">
            <UiText text="Thông tin thanh toán" weight="semibold" size="base"
              class="py-3 border-b border-gray-200 dark:border-gray-800" />
            <UiFlex justify="between" class="my-4">
              <UiText size="sm" color="gray" weight="semibold">Kênh</UiText>
              <UiText size="sm" weight="semibold">{{ state.gate.name || "..." }}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-4">
              <UiText size="sm" color="gray" weight="semibold" mini>Người nhận</UiText>
              <UiText size="sm" weight="semibold" align="right" class="ml-4">{{state.gate.person || "..."}}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-4">
              <UiText size="sm" color="gray" weight="semibold" mini>Số tài khoản</UiText>
              <UiFlex @click="startCopy(state.gate.number)">
                <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ state.gate.number }}</UiText>
                <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
              </UiFlex>
            </UiFlex>
            <UiFlex justify="between" class="mb-4">
              <UiText size="sm" color="gray" weight="semibold" mini>Số tiền</UiText>
              <UiFlex @click="startCopy(totalPrice)">
                <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ useMoney().toMoney(totalPrice)
                  }}</UiText>
                <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
              </UiFlex>
            </UiFlex>
            <UiFlex justify="between" class="mb-4">
              <UiText size="sm" color="gray" weight="semibold" mini>Nội dung</UiText>
              <UiFlex @click="startCopy(state.code)">
                <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ state.code }}</UiText>
                <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
              </UiFlex>
            </UiFlex>
          </div>
          <div v-else>
            <UiText text="Chưa có phương thức thanh toán" weight="semibold" size="base" />
          </div>
          <UFormGroup label="Ghi chú (tuỳ chọn)">
            <UTextarea v-model="state.note" placeholder="Ghi chú" class="mt-4" />
          </UFormGroup>
        </div>
        <div class="col-span-12 md:col-span-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-fit">
          <UiText text="Đơn hàng" weight="semibold" size="base"
            class="pb-3 border-b border-gray-200 dark:border-gray-800" />
          <div class="mt-3">
            <UiFlex v-for="item in cartStore.cart" justify="between"
              class="py-2 border-b border-gray-200 dark:border-gray-800">
              <UiText size="sm">{{ item.product.name }} / {{ item.option.number }} Th</UiText>
              <UiText size="sm" align="right">{{ useMoney().toMoney(item.option.price * item.quantity) || "..." }}đ
              </UiText>
            </UiFlex>
          </div>
          <UiFlex justify="between" class="my-4">
            <UiText size="sm" weight="semibold" color="red">Tổng cộng :</UiText>
            <UiText size="sm" weight="semibold" color="red" align="right">{{ useMoney().toMoney(totalPrice) || "..." }}đ
            </UiText>
          </UiFlex>
          <UButton type="button" @click="checkout" :loading="loading"  class="btn btn-primary w-full h-[40px] justify-center align-center mt-3">Hoàn tất </UButton>
          <NuxtLink href="/cart" class="btn btn-primary w-full justify-center text-primary align-center mt-2 text-center block" size="md">  Quay lại</NuxtLink>
        </div>
      </div>
    </div>
    <div v-if="!cartStore.cart || cartStore.cart.length === 0 && authStore.isLogin">
      <UiEmpty class="mt-20" title="Giỏ hàng rỗng" />
      <NuxtLink href="/" class="btn btn-primary w-full mt-3 text-center block hover:underline text-primary" size="md">
        Quay lại</NuxtLink>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: () => "Thanh toán - ENI",
  ogTitle: () => "Thanh toán - ENI"
})
import { useClipboard } from "@vueuse/core";
const { copy, isSupported } = useClipboard();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const loading = ref(false);
const list = ref<any>([]);
const state = ref<any>({
  index: 0,
  note: null,
  gate: undefined,
  code: authStore.profile?.username + "-" + Math.random().toString(36).substring(2, 5).toUpperCase(),
})
const totalPrice = computed(() => {
  return cartStore?.cart?.reduce((total: number, item: any) => {
    return total + item.option.price * item.quantity;
  }, 0);
});
const startCopy = (text: string) => {
  if (!isSupported.value || !text) return;
  copy(text);
  useNotify().success("Sao chép vào bộ nhớ tạm thành công");
};
const getOption = (item: any, index: number) => {
  state.value.index = index
  state.value.gate = item
};
const checkout = async () => {
  try {
    loading.value = true
    const data = JSON.stringify(state.value)
    await cartStore.checkout(data)
    loading.value = false
    router.push('/order')
  }
  catch (e) {
    loading.value = false
    console.error(e)
  }
}
const gate = async () => {
  try {
    loading.value = true
    const data = await useAPI('client/gate/select')
    list.value = data
    state.value.gate = data[0]
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
gate()
</script>
