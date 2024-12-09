<template>
  <div>
    <!-- VPS GIÁ RẺ -->
    <div class="relative pt-8 pb-5">
      <UiText text="BẢNG GIÁ THUÊ CLOUD VPS GIÁ RẺ" class="text-center text-xl md:text-3xl font-bold text-black mb-4" />
      <UiText text="Nhanh hơn - rẻ hơn" class="text-center text-lg text-black" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12  lg:gap-6 md:gap-4 gap-2" v-if="!!loading || !list">
      <LoadingProductBox v-for="i in 8" :key="i" class="xl:col-span-3 lg:col-span-4 col-span-6" />
    </div>
    <div v-else>
      <UiEmpty v-if="list.length == 0" title="Hiện tại chưa có dữ liệu" />
      <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-6 md:gap-4 gap-2 md:mb-6 mb-4" v-else>
        <ServiceProductBox v-for="product in list" :key="product._id" :product="product"
          class="xl:col-span-3 lg:col-span-4 col-span-6 " />
      </div>
    </div>
    <!-- VPS CAO CẤP -->
    <div>
      <div class="relative pt-8 pb-5">
        <UiText text="BẢNG GIÁ THUÊ CLOUD VPS CAO CẤP"
          class="text-center text-xl md:text-3xl font-bold text-black mb-4" />
        <UiText text="Nhanh hơn - cao cấp hơn" class="text-center text-lg text-black" />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-12  lg:gap-6 md:gap-4 gap-2" v-if="!!loading || !list">
        <LoadingProductBox v-for="i in 8" :key="i" class="xl:col-span-3 lg:col-span-4 col-span-6" />
      </div>
      <div v-else>
        <UiEmpty v-if="list.length == 0" title="Hiện tại chưa có dữ liệu" />
        <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-6 md:gap-4 gap-2 md:mb-6 mb-4" v-else>
          <ServiceProductBox v-for="product in products" :key="product._id" :product="product"
            class="xl:col-span-3 lg:col-span-4 col-span-6 " />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const list = ref(undefined)
const products = ref(undefined)
const loading = ref(false)

const getProduct = async () => {
  try {
    loading.value = true;
    const data = await useAPI('client/product/category', { key: 'vps-gia-re' });
    list.value = data.list;
    loading.value = false;
  } catch (e) {
    loading.value = false
  }
}
const getProduct1 = async () => {
  try {
    loading.value = true;
    const product = await useAPI('client/product/category', { key: 'vps-cao-cap' });
    products.value = product.list;
    loading.value = false;
  } catch (e) {
    loading.value = false
  }
}

nextTick(async () => {
  await getProduct()
  await getProduct1()
})

</script>

<style lang="scss" scoped></style>