<template>
  <div>
    <UiFlex class="gap-2 mb-6">
      <UForm :state="page" @submit="get" class="mr-1">
        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1 border border-gray-200 dark:border-gray-800 rounded-xl" />
      </UForm>
      <USelectMenu v-model="page.category" :options="[{ name: 'Tất cả', _id: '' }, ...category]" placeholder="Danh mục"
        size="md" option-attribute="name" class="border border-gray-200 dark:border-gray-800 rounded-xl" />
    </UiFlex>
    <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2" v-if="!!loading || !list">
      <LoadingProductBox v-for="i in page.size" :key="i" class="xl:col-span-3 lg:col-span-4 col-span-6" />
    </div>
    <div v-else>
      <UiEmpty v-if="list.length == 0" title="Hiện tại chưa có dữ liệu" />
      <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-6 md:gap-4 gap-2 md:mb-6 mb-4 " v-else>
        <ServiceProductBox v-for="product in list" :key="product._id" :product="product"
          class="xl:col-span-3 lg:col-span-4 col-span-6" />
      </div>
      <UiFlex justify="center" v-if="list.length < page.total">
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" show-last show-first />
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const page = ref({
  category: null,
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

const list = ref(undefined)
const category = ref([])
const loading = ref(true)

watch(() => page.value.category, () => get())
watch(() => page.value.current, () => get())
watch(() => page.value.sort, () => get())
watch(() => page.value.size, () => get())
watch(() => page.value.search.key, (val) => !val && get())

const get = async () => {
  try {
    loading.value = true;
    const data = await useAPI('client/product/list', JSON.parse(JSON.stringify(page.value)));
    list.value = data.list;

    page.value.total = data.total;
    category.value = data.listCategory
    loading.value = false;
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(async () => {
  await nextTick()
  get()
})
</script>