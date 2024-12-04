<template>
  <div>
    <UTooltip @click="modal = true"
      class="fixed bottom-6 cursor-pointer bg-primary right-4 dark:bg-primary border border-primary-200 dark:border-primary-800 rounded-full p-3 flex items-center justify-center transition-transform transform hover:scale-110"
      text="Liên hệ hỗ trợ" :popper="{ placement: 'top' }">
      <UIcon size="20" class="text-white" name="material-symbols:chat" />
    </UTooltip>
    <UModal v-model="modal">
      <UCard>
        <UiFlex class="mb-6">
          <UiIcon name="i-bxs-business" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Tổ chức</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.name || '...' }}</UiText>
        </UiFlex>
        <UiFlex class="mb-6">
          <UiIcon name="i-bxs-map" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Địa chỉ</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.address || '...' }}</UiText>
        </UiFlex>
        <UiFlex class="mb-6">
          <UiIcon name="i-bxs-phone" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Điện thoại</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.phone || '...' }}</UiText>
        </UiFlex>
        <UiFlex>
          <UiIcon name="i-bxs-envelope" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Hòm thư</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.email || '...' }}</UiText>
        </UiFlex>
        <template #footer>
          <UiFlex justify="center" class="mt-4 gap-2" wrap>
            <div class="cursor-pointer" v-for="(value, key) in social" :key="key" @click="open(value)">
              <UTooltip :text="`${key}`" :popper="{ placement: 'top' }">
                <UiImg class="max-w-[45px] max-h-[45px] rounded-full" :src="`/images/social/${key}.webp`" w="1" h="1"
                  imgW="90" imgH="90" :alt="key"></UiImg>
              </UTooltip>
            </div>
          </UiFlex>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const configStore = useConfigStore()
configStore.bootConfig()
const contact = ref(configStore.config.contact)
const social = ref(configStore.config.social)
const modal = ref(false)
const open = (url: any) => {
  if (!url) return useNotify().error('Chúng tôi đang cập nhật thông tin, vui lòng quay lại sau')
  window.open(url, '_blank')
}
</script>