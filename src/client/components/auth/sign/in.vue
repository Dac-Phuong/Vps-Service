<template>
  <UForm :state="state" :validate="validate" @submit="submit">
    <UFormGroup label="Tài khoản" name="account">
      <UInput icon="i-bxs-user" v-model="state.account" />
    </UFormGroup>

    <UFormGroup label="Mật khẩu" name="password">
      <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
    </UFormGroup>

    <UiFlex justify="between">
      <UiText color="gray" size="sm" class="mr-2 cursor-pointer" @click="emits('update:tab', 1)">Đăng ký tài khoản?</UiText>
      <UButton type="submit" :loading="loading">Đăng Nhập</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const emits = defineEmits(['done', 'update:tab'])
const props = defineProps({
  tab: {
    type: Number,
    default: 0
  }
})
const authStore = useAuthStore()
const loading = ref(false)
const state = ref({
  account: null,
  password: null
})

const validate = (state) => {
  const errors = []
  if (!state.account) errors.push({ path: 'account', message: 'Vui lòng nhập đầy đủ' })
  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

const submit = async () => {
  try {
    if (!!loading.value) return
    loading.value = true

    await useAPI('auth/sign/in', JSON.parse(JSON.stringify(state.value)))
    await authStore.getAuth()

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>

