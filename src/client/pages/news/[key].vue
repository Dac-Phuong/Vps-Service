<template>
  <UContainer class="p-2">
    <LoadingNewsId v-if="loading || !news" />
    <UiFlex v-else type="col" justify="center">
      <UiSlide :images="news.images" class="mb-4 w-full max-h-3xl" />
      <div class="mb-4 ">
        <UiText color="primary" weight="bold" class="text-xl lg:text-2xl mb-2">{{ news.title }}</UiText>
        <UiText color="gray" class="text-md lg:text-md text-center">{{ news.description }}</UiText>
      </div>

      <UDivider label="Nội Dung" class="mb-4" />
      <div class="mb-4 w-full">
        <DataEditor :content="news.content" empty="Chưa có nội dung"></DataEditor>
      </div>
    </UiFlex>
  </UContainer>
</template>

<script setup>
const { img } = useMakeLink()
const configStore = useConfigStore()
const route = useRoute()
const loading = ref(false)
const news = ref(undefined)

const getNews = async () => {
  try {
    loading.value = true
    const data = await useAPI('client/news/get', {
      key: route.params.key
    })

    loading.value = false
    news.value = data
  }
  catch (e){
    loading.value = false
  }
}

getNews()
</script>