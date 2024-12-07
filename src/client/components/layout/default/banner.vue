<template>
  <USkeleton class="relative h-[360px] mb-3 " v-if="loading" />
  <div v-if="banner" class="
    ServiceHomeBanner 
    relative 
  ">
    <!-- Image -->
    <UiImg :src="banner?.config?.image?.og || '/images/null.webp'" class="!absolute  w-full h-full top-0 left-0"/>
    <!-- Overlay -->
    <div class="
      absolute 
      w-full h-full 
      top-0 left-0
    "></div>
    <!-- Content -->
    <div class="md:ml-0 lg:ml-40">
      <UiFlex type="col" items="start" justify="center" class="
        relative
        w-full h-full 
        md:py-32 p-4
        aspect-auto
      ">
        <!-- Name -->
        <UiText weight="bold" color="primary" class="xl:text-5xl md:text-4xl text-2xl mb-2"
          style="text-shadow: 0px 0px 5px rgba(0,0,0,0.5);">
          {{ banner.config.name || 'ENI VPS SERVICE' }}
        </UiText>
        <!-- Description -->
        <UiText weight="semibold" class="xl:text-2xl md:text-xl text-base text-white md:max-w-xl">
          {{ banner.config.description || 'Kênh bán VPS giá rẻ và chất lượng tốt nhất' }}
        </UiText>
        <!-- About -->
        <UButton class="mt-6" @click="router.push('/shop')" size="md">Xem Thêm</UButton>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const banner = ref(undefined)
const loading = ref(true)
const router = useRouter()
const getBanner = async () => {
  try {
    const data = await useAPI('client/config/banner')
    loading.value = false
    banner.value = data
  }
  catch (e) {
    loading.value = false
  }
}

getBanner()
</script>

<style lang="sass">
</style>