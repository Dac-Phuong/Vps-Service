<template>
  <UContainer class="p-2">
    <div v-if="!!product" class="mt-3">
      <UBreadcrumb class="mb-3" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: product.name }, { label: 'Đăng ký' }]" />
      <div>
        <UForm class="grid grid-cols-1 md:grid-cols-12 gap-2" :validate="validate" :state="state" @submit="addToCart">
          <div class="col-span-12 md:col-span-8 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <UiText text="Sản phẩm đã chọn" weight="semibold" size="base" class="mb-3" />
            <UiFlex class="gap-2 mt-5 mb-2 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
              justify="between">
              <div>
                <UiText size="sm" color="gray" weight="">{{ product?.category?.name || "..." }}</UiText>
                <UiText size="sm" weight="semibold" class="mt-2">{{ product?.name || "..." }}</UiText>
              </div>
              <UButton color="primary" size="sm" @click="router.push('/shop')">
                <UiText size="sm" weight="semibold">Thay đổi</UiText>
              </UButton>
            </UiFlex>
            <UiFlex v-for="(item, index) in product.specs" :key="index"
              class="gap-2 mb-2 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
              <UiText size="sm" weight="semibold">{{ item.key }} :</UiText>
              <UiText size="sm" color="gray">{{ item.value }}</UiText>
            </UiFlex>
            <UiText text="Chu kỳ thanh toán" weight="semibold" size="base" class="my-3" />
            <div class="grid-cols-12 grid gap-4">
              <div v-for="(option, index) in product.options" :key="index" @click="getOption(option, index)"
                :class="['grid col-span-6 md:col-span-2 h-20 flex flex-col justify-center items-center rounded-lg border relative cursor-pointer', index === state.option.index ? 'border-primary' : 'border-gray-200 dark:border-gray-600']">
                <div class="absolute top-1 right-2">
                  <UiIcon size="6" color="primary" name="iconamoon:check-bold" v-if="index === state.option.index" />
                </div>
                <div class="text-center">
                  <UiText class="text-sm font-medium">{{ option.number }} Tháng </UiText>
                  <UiText class="text-sm font-medium">{{ useMoney().toMoney(option?.price) }}</UiText>
                </div>
              </div>
            </div>
            <UiFlex class="w-full flex-wrap md:flex-nowrap my-4">
              <UFormGroup label="Đặt tên máy chủ" class="w-full md:w-2/4" name="server">
                <UInput v-model="state.server" class="w-full" placeholder="servername.yourdomain.com" />
              </UFormGroup>
              <UFormGroup label="Hệ điều hành" class="w-full md:w-2/4 md:ml-2" name="os">
                <SelectOs v-model="state.os" />
              </UFormGroup>
            </UiFlex>
          </div>
          <div class="col-span-12 md:col-span-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-fit">
            <UiText text="Thống kê đơn hàng" weight="semibold" size="base"
              class="pb-3 border-b border-gray-200 dark:border-gray-800" />
            <div class="mt-3 border-b border-gray-200 dark:border-gray-800">
              <UiFlex justify="between" class="my-4">
                <UiText size="sm" weight="semibold">{{ product.name }}</UiText>
                <UiText size="sm" weight="semibold" align="right">{{ useMoney().toMoney(product.price) || "..." }} đ
                </UiText>
              </UiFlex>
              <UiFlex justify="between" class="my-4">
                <UiText size="sm">Dịch vụ khác :</UiText>
                <UiText size="sm" align="right">...</UiText>
              </UiFlex>
              <UiFlex justify="between" class="my-4">
                <UiText size="sm">Phí cài đặt :</UiText>
                <UiText size="sm" align="right">...</UiText>
              </UiFlex>
              <UiFlex justify="between" class="my-4">
                <UiText size="sm">{{ state.option?.number }} tháng :</UiText>
                <UiText size="sm" align="right">{{ useMoney().toMoney(state.option?.price) || "..." }} đ</UiText>
              </UiFlex>
            </div>
            <UiFlex justify="between" class="my-4">
              <UiText size="sm" weight="semibold" color="red">Tổng cộng :</UiText>
              <UiText size="sm" weight="semibold" color="red" align="right">{{ useMoney().toMoney(state.option?.price)
                || "..." }} đ</UiText>
            </UiFlex>
            <UButton type="submit" class="btn btn-primary w-full h-[40px] justify-center align-center mt-3"
              icon="material-symbols:shopping-cart" :loading="loading">Thêm vào giỏ hàng</UButton>
            <NuxtLink href="/" class="btn btn-primary w-full justify-center align-center mt-2 text-center block"
              size="md">Quay lại</NuxtLink>
          </div>
        </UForm>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const router = useRouter();
const { setCart } = useCartStore();
const route = useRoute();
const loading = ref(false);
const product = ref<any>({});
const modal = ref(false);

useSeoMeta({
  title: "Sản phẩm - ENI",
  ogTitle: "Sản phẩm - ENI"
})
// state
const state = ref<any>({
  key: route.params.key,
  option: undefined,
  server: "",
  os: undefined
});
const getOption = (option: any, index: number) => {
  state.value.option = {
    index,
    price: option.price,
    number: option.number
  };
};
const validate = (state: any) => {
  const errors = [];
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng nhập tên máy chủ' });
  if (state.server.length < 3) errors.push({ path: 'server', message: 'Tên máy chủ ít nhất 3 ký tự' });
  if (/[^\x00-\x7F]/.test(state.server) || /\s/.test(state.server)) errors.push({ path: 'server', message: 'Tên máy chủ không hợp lệ' });
  if (!state.os) errors.push({ path: 'os', message: 'Vui lòng chọn hệ điều hành' });
  return errors
}
const get = async () => {
  try {
    loading.value = true;
    const data = await useAPI("client/product/get", { key: route.params.key });
    product.value = data;
    state.value.option = {
      index: 0,
      price: data.options[0].price,
      number: data.options[0].number
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
function randomText(length: number) {
  return Array.from({ length }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
}
const addToCart = async () => {
  try {
    loading.value = true;
    state.value.server = state.value.server.trim() + '-' + randomText(4);
    await setCart(JSON.parse(JSON.stringify(state.value)));
    loading.value = false;
    modal.value = false;
    state.value.server = "";
  } catch (e) {
    loading.value = false;
  }
};
get();
</script>
