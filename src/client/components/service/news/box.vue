<template>
  <UCard v-if="news" class="BoxNews shadow-lg relative" :ui="{
    body: { padding: 'p-0 sm:p-0' },
    background: 'bg-gray-50 dark:bg-gray-800'
  }">
    <div @click="open(news.key)" class="cursor-pointer w-full">
      <UiImg 
        :src="news.og_image" 
        ratio="12 / 9"
        w="100%"
      />
    </div>

    <div class="lg:p-4 p-2 lg:pt-2 pt-1">
      <NuxtLink :to="`/news/${news.key}`" class="lg:text-lg md:text-md text-sm line-clamp-1 text-gray hover:text-primary">
        {{ news.title }}
      </NuxtLink>
      <UiText class="line-clamp-1 lg:text-md md:text-sm text-xs" color="gray">{{ news.description }}</UiText>
      <UBadge color="primary" class="cursor-pointer mt-2 absolute right-2 top-0">{{ news.category.name }}</UBadge>
    </div>

  </UCard>
</template>

<script setup>
const props = defineProps(['news'])

const open = async (key) => {
  await navigateTo(`/news/${key}`)
}
</script>

<style lang="sass">
.BoxNews
  transition: all 0.25s ease
  &:hover
    transform: translateY(-5px)
</style>
