<template>
  <UCard v-if="state" class="sm:w-full lg:w-3/4">
    <UForm :state="state">
      <UFormGroup label="Họ tên">
        <UInput v-model="state.username" />
      </UFormGroup>
      <UFormGroup label="Hòm thư (Email)">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Số điện thoại">
        <UInput v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Địa chỉ">
        <UInput v-model="state.address" />
      </UFormGroup>

      <UFormGroup label="Số CMND/CCCD">
        <UInput v-model="state.cccd" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-4">
        <UButton @click="submit" :loading="loading">Cập nhật</UButton>
      </UiFlex>
    </UForm>
  </UCard>
</template>

<script setup>
const authStore = useAuthStore()
const loading = ref(false)
const state = ref(JSON.parse(JSON.stringify(authStore.profile)))
console.log(state.value);

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/edit', JSON.parse(JSON.stringify(state.value)))
    await authStore.getAuth()
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}
</script>