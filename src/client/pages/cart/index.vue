<template>
  <UContainer class="p-2">
    <UBreadcrumb class="mb-3 mt-2" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Giỏ hàng' }]" />
    <div v-if="!!cartStore.cart && cartStore.cart.length > 0 && authStore.isLogin" class="mt-3">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
        <div class="col-span-12 md:col-span-8 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <UiText text="Xác nhận đơn hàng" weight="semibold" size="base" class="mb-3" />
          <UiFlex v-for="item in cartStore.cart"
            class="gap-2 mt-5 mb-2 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex-col md:flex-row  md:items-center"
            justify="between">
            <div class="md:w-1/2">
              <UiText size="sm" color="gray" class="mt-2">{{ item.product?.category.name || "..." }}</UiText>
              <UiText size="sm" weight="semibold">{{ item.product.name || "..." }}</UiText>
              <UiFlex class="mt-2 flex-wrap">
                <UiText size="sm" weight="semibold">Chu kì thanh toán : </UiText>
                <UiFlex>
                  <UiText size="sm" class="ml-2"> {{ item.option.number || "..." }} Tháng /</UiText>
                  <UiText color="red" size="sm" class="ml-1">{{ useMoney().toMoney(item.option.price) || "..." }}đ
                  </UiText>
                </UiFlex>
              </UiFlex>
            </div>
            <div class="md:w-1/2 md:mt-0 mt-4 items-center">
              <UiFlex>
                <UTooltip @click="showOptions(item.product.options, item.option.index, item._id)"
                  class="mr-2 ml-auto w-max" text="Sửa cấu hình" :popper="{ placement: 'top' }">
                  <UButton color="gray" size="sm">Sửa cấu hình</UButton>
                </UTooltip>
                <UTooltip text="Xóa sản phẩm" :popper="{ placement: 'top' }" @click="cartStore.delCart(item._id)">
                  <UButton color="red" icon="material-symbols:delete" size="sm"></UButton>
                </UTooltip>
              </UiFlex>
              <UiFlex color="primary" class="mt-2 " size="sm">
                <UButton size="sm" weight="semibold" class="ml-auto w-max"
                  icon="material-symbols:check-indeterminate-small"
                  @click="updateCartQuantity(item._id, item.quantity - 1)">
                </UButton>
                <UiText size="sm" weight="semibold" class="ml-2">{{ item.quantity }}</UiText>
                <UButton size="sm" weight="semibold" class="ml-2" icon="material-symbols:add"
                  @click="updateCartQuantity(item._id, item.quantity + 1)"></UButton>
              </UiFlex>
            </div>
          </UiFlex>
          <NuxtLink href="/shop" class="btn btn-primary w-full mt-3 text-end block hover:underline text-primary"
            size="md">
            Chọn thêm dịch vụ khác</NuxtLink>
        </div>
        <div class="col-span-12 md:col-span-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-fit">
          <UiText text="Thống kê đơn hàng" weight="semibold" size="base"
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
          <UButton type="button" @click="router.push('/cart/checkout')"
            class="btn btn-primary w-full h-[40px] justify-center align-center mt-3">Thanh toán
          </UButton>
          <NuxtLink href="/shop"
            class="btn btn-primary w-full justify-center text-primary align-center mt-2 text-center block" size="md">
            Quay lại</NuxtLink>
        </div>
      </div>
      <!-- Modal edit -->
      <UModal v-model="modal" v-if="state.options && state.options.length > 0" prevent-close>
        <UForm :state="state" @submit="editOption" class="p-4">
          <div class="grid-cols-12 grid gap-2">
            <div v-for="(item, index) in state.options" :key="index" @click="getOption(item, index)"
              :class="['grid col-span-6 md:col-span-3 h-20 flex flex-col justify-center items-center rounded-lg border relative cursor-pointer', index === state.index ? 'border-primary' : 'border-gray-200 dark:border-gray-600']">
              <div class="absolute top-2 right-2">
                <UiIcon size="6" color="primary" name="iconamoon:check-bold" v-if="index === state.index" />
              </div>
              <div class="text-center">
                <UiText class="text-sm font-medium">{{ item.number }} Tháng </UiText>
                <UiText class="text-sm font-medium">{{ useMoney().toMoney(item?.price) }}</UiText>
              </div>
            </div>
          </div>
          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" :loading="loading">Xác nhận</UButton>
            <UButton color="gray" @click="modal = false" :disabled="loading" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UModal>
    </div>
    <UiAuth v-if="!authStore.isLogin" title="Vui lòng đăng nhập" />
    <UiEmpty v-if="cartStore.cart && cartStore.cart.length === 0 && authStore.isLogin" class="mt-32" title="Giỏ hàng rỗng" />
  </UContainer>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: () => "Giỏ hàng - ENI",
  ogTitle: () => "Giỏ hàng - ENI"
})
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const modal = ref(false);
const loading = ref(false);
const state = ref({
  _id: "",
  options: [] as any,
  option: {},
  index: 0
})

const totalPrice = computed(() => {
  return cartStore?.cart?.reduce((total: number, item: any) => {
    return total + item.option.price * item.quantity;
  }, 0);
});

const getOption = (option: any, index: number) => {
  state.value.index = index
  state.value.option = {
    index,
    price: option.price,
    number: option.number
  };
};
const showOptions = (options: any[], index: number, _id: string) => {
  state.value = { options, index, _id, option: {} };
  modal.value = true;
};

const updateCartQuantity = async (id: string, quantity: number) => {
  if (quantity < 1) return
  try {
    const data = JSON.stringify({ _id: id, quantity: quantity })
    await cartStore.updateCart(data)
  } catch (error) {
    console.error(error)
  }
}

const editOption = async () => {
  try {
    const data = JSON.stringify({ _id: state.value._id, option: state.value.option })
    await cartStore.updateOption(data)
    modal.value = false
  } catch (error) {
    console.error(error)
  }
}

</script>