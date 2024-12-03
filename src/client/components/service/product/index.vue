<template>
  <div>
    <div class="relative py-10" >
      <UiText text="BẢNG GIÁ THUÊ CLOUD VPS GIÁ RẺ" class="text-center text-xl md:text-3xl font-bold text-black mb-4"  />
      <UiText text="NHANH HƠN - RẺ HƠN" class="text-center text-lg text-black"  />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12  lg:gap-6 md:gap-4 gap-2" v-if="!!loading.product || !list">
      <LoadingProductBox v-for="i in 8" :key="i" class="xl:col-span-3 lg:col-span-4 col-span-6" />
    </div>
    <div v-else>
      <UiEmpty v-if="list.length == 0" title="Hiện tại chưa có dữ liệu" />
      <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-6 md:gap-4 gap-2 md:mb-6 mb-4 " v-else>
        <ServiceProductBox v-for="product in list" :key="product._id" :product="product" class="xl:col-span-3 lg:col-span-4 col-span-6" />
      </div>
      <UiFlex class="gap-2 mb-6">
        <UButton color="primary" class="mx-auto rounded" @click="router.push('/shop')" v-if="!!list && list.length < page.total" icon="ic:baseline-arrow-forward" >Xem Thêm</UButton>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
})
const router = useRouter()
const list = ref(undefined)
const loading = ref({
  product: false
})
const page = ref({
  size: 8,
  current: 1,
  sort: {
    column: 'updatedAt',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'NAME'
  },
  total: 0
})

watch(() => page.value.category, () => getProduct())

const getProduct = async () => {
  try {
    loading.value.product = true;
    const data = await useAPI('client/product/category', JSON.parse(JSON.stringify(page.value)));
    list.value = data.list;
    loading.value.product = false;
  } catch (e) {
    loading.value.product = false
  }
}
getProduct()

</script>

<style lang="scss" scoped>

</style>