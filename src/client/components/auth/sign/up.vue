<template>
  <UForm :state="state" :validate="validate" @submit="submit">
    <UFormGroup label="Tài khoản" name="account" :hint="`${state.account ? state.account.length : 0}/15`">
      <UInput icon="i-bxs-user" v-model="state.account" />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput icon="i-bxs-envelope" v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Điện thoại" name="phone">
      <UInput icon="i-bxs-phone" v-model="state.phone" />
    </UFormGroup>

    <UFormGroup label="Mật khẩu" name="password" :hint="`${state.password ? state.password.length : 0}/15`">
      <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
    </UFormGroup>
    <UiFlex justify="between">
      <UiText color="gray" size="sm" class="cursor-pointer mr-2" @click="emits('update:tab', 0)">Đăng nhập ngay?</UiText>
      <UButton type="submit" :loading="loading">Đăng Ký</UButton>
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
  account: undefined,
  email: undefined,
  phone: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.account) errors.push({ path: 'account', message: 'Vui lòng nhập đầy đủ' })
  else if (state.account.length < 6 || state.account.length > 15) errors.push({ path: 'account', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.account.match(/\s/g)) errors.push({ path: 'account', message: 'Phát hiện khoảng cách' })
  else if (!(/^[a-z0-9]*$/g).test(state.account)) errors.push({ path: 'account', message: 'Phát hiện ký tự đặc biệt và viết hoa' })
  else if (!!state.account.includes('admin') || !!state.account.includes('smod') || !!state.account.includes('robot')) errors.push({ path: 'account', message: 'Danh xưng không hợp lệ' })

  if (!state.email) errors.push({ path: 'email', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: 'Định dạng không đúng' })

  if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: 'Định dạng không đúng' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })

  return errors
}

const submit = async () => {
  try {
    if(!!loading.value) return
    loading.value = true
    await useAPI('auth/sign/up', JSON.parse(JSON.stringify(state.value)))
    await authStore.getAuth()
    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>