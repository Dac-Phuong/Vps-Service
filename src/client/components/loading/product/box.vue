<template>
  <UCard
    :ui="{ 
      base: 'relative transition-all ',
      rounded: 'rounded-xl',
      shadow: 'shadow-md hover:shadow-lg',
      divide: '',
      ring: 'dark:ring-1 ring-0',
      body: { padding: 'p-0 sm:p-0' },
    }"
  > 
    <div style="aspect-ratio: 8 / 9">
      <USkeleton class="w-full h-full rounded-none" />
    </div>
  </UCard>
</template>