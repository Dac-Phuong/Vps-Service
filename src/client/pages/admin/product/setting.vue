<template>
  <UiContent title="Setting" sub="Quản lý cài đặt nâng cấp VPS" class="max-w-3xl mx-auto">
    <UForm :state="state" @submit="submit">
      <UFormGroup label="Giá nâng cấp (CPU / 1 CPU)" name="cpu">
        <UInput :loading="loading" class="border rounded-lg" v-model="state.cpu" />
      </UFormGroup>
      <UFormGroup label="Giá nâng cấp (RAM / 1 GB) " name="ram">
        <UInput :loading="loading" class="border rounded-lg" v-model="state.ram" />
      </UFormGroup>
      <UFormGroup label="Giá nâng cấp (Disk / 1 GB)" name="disk">
        <UInput :loading="loading" class="border rounded-lg" v-model="state.disk" />
      </UFormGroup>
      <UiFlex justify="end" class="mt-4">
        <UButton type="submit" :loading="loading">Cập nhật</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script lang="ts" setup>
const loading = ref(false)
const state = ref({
  ram: 0,
  cpu: 0,
  disk: 0
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('admin/product/config/edit', JSON.parse(JSON.stringify(state.value)))
    getConfig();
    loading.value = false
  } catch {
    loading.value = false
  }
}
const getConfig = async () => {
  try {
    loading.value = true
    const data = await useAPI('admin/product/config/get')
    state.value = data.product
    loading.value = false
  } catch {
    loading.value = false
  }
}
getConfig()
</script>

<style></style>