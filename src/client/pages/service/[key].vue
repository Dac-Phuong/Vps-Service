<template>
  <div>
    <UBreadcrumb class="mb-3" divider="/"
      :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Quản lý dịch vụ', to: '/service' }, { label: 'Chi tiết dịch vụ' }]" />
    <div v-if="item?.status == 0"
      class="w-full rounded-lg p-3 dark:bg-red-400 dark:bg-opacity-10 text-red-500 dark:text-red-400 bg-red-500 bg-opacity-10 mb-4">
      <UiFlex justify="between">
        <UiText color="red" size="sm">Đơn hàng chưa thanh toán</UiText>
        <UiText class="cursor-pointer" @click="modal = true" color="red" size="sm">Thanh toán ngay</UiText>
      </UiFlex>
    </div>

    <UCard class="mt-5">
      <UiFlex class="gap-2 py-2 pt-0 rounded-lg border-b border-gray-200 dark:border-gray-800 flex-wrap"
        justify="between">
        <UiFlex class="pb-2 md:w-1/2 w-full md:justify-start justify-between">
          <UiText size="sm" weight="semibold" class="mt-2">{{ item.product?.name || "..." }}</UiText>
          <UBadge size="sm" weight="semibold" class="mt-2 ml-2" :color="statusFormat[item.status]?.color">
            {{ statusFormat[item.status]?.label }}</UBadge>
        </UiFlex>
        <UiFlex class="pb-2">
          <div class="pr-2 border-r border-gray-200 dark:border-gray-600">
            <UiText size="sm">Ngày đăng ký : </UiText>
            <UiText size="sm" weight="semibold"> {{ useDayJs().displayFull(item.createdAt) || "..." }}</UiText>
          </div>
          <div class="ml-2">
            <UiText size="sm">Ngày hết hạn: </UiText>
            <UiText size="sm" weight="semibold"> {{ item.end_time ? useDayJs().displayFull(item.end_time) : "..." }}
            </UiText>
          </div>
        </UiFlex>
      </UiFlex>
      <UiFlex class="py-4 flex-wrap" justify="between">
        <div>
          <UiText size="sm" weight="semibold">Thanh toán lần đầu</UiText>
          <UiText size="sm" color="gray" class="pt-2">{{ item.money ? useMoney().toMoney(item.money) : 0 }} đ</UiText>
        </div>
        <div>
          <UiText size="sm" weight="semibold">Chu kỳ thanh toán</UiText>
          <UiText size="sm" color="gray" class="pt-2">{{ item.number || "..." }} Tháng</UiText>
        </div>
        <div>
          <UiText size="sm" weight="semibold">Số tiền thanh toán định kỳ</UiText>
          <UiText size="sm" color="gray" class="pt-2">{{ item.money ? useMoney().toMoney(item.money) : 0 }} đ</UiText>
        </div>
        <div>
          <UiText size="sm" weight="semibold">SL máy chủ VPS</UiText>
          <UiText size="sm" color="gray" class="pt-2">{{ item.quantity || "..." }}</UiText>
        </div>
      </UiFlex>
      <div class="py-3 border-t border-gray-200 dark:border-gray-800">
        <UiText size="base" weight="semibold">Thông tin máy chủ</UiText>
        <div v-if="item.info && item.info.length > 0" v-for="(server, index) in item.info"
          class="border border-gray-200 dark:border-gray-800 rounded-lg p-3 mt-2">
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm" >Tên máy chủ: </UiText>
            <UiText size="sm" weight="semibold"class="ml-2">{{ item.server || "..." }}</UiText>
          </UiFlex>
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm" >Địa chỉ IP : </UiText>
            <UiText size="sm" weight="semibold"class="ml-2">{{ server.ip || "..." }}</UiText>
          </UiFlex>
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm" >Tài khoản: </UiText>
            <UiText size="sm" weight="semibold"class="ml-2">{{ server.account || "..." }}</UiText>
          </UiFlex>
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm" >Mật khẩu: </UiText>
            <UiFlex>
              <UiText weight="semibold" size="sm" class="ml-2">{{ item.status == 1 && showPassword[index] ? server.password :  "............." }}</UiText>
              <UiIcon :name="showPassword[index] ? 'i-bxs-hide' : 'i-bxs-show'" color="primary" class="ml-2" pointer @click="showPassword[index] = !showPassword[index]" v-if="item.status == 1" />
            </UiFlex>
          </UiFlex>
        </div>
        <UiText size="sm" class="mt-2" v-else color="red">Chưa có thống tin máy chủ</UiText>
      </div>
      <UiFlex class="mt-2">
        <UButton icon="material-symbols:upload-rounded" :disabled="item.status !== 1" @click="upgrade" color="primary">
          Nâng cấp gói</UButton>
      </UiFlex>
    </UCard>
    <UModal v-model="modal" prevent-close>
      <UCard >
        <UiFlex justify="between" class="mb-6">
          <UiText size="sm" color="gray" weight="semibold">Kênh</UiText>
          <UiText size="sm" weight="semibold">{{ item.order.gate?.name || '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="mb-6">
          <UiText size="sm" color="gray" weight="semibold" mini>Người hưởng thụ</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ item.order.gate?.person || '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="mb-6">
          <UiText size="sm" color="gray" weight="semibold" mini>Số tài khoản</UiText>

          <UiFlex @click="startCopy(item.order.gate?.number)">
            <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ item.order.gate?.number }}
            </UiText>
            <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
          </UiFlex>
        </UiFlex>

        <UiFlex justify="between" class="mb-6">
          <UiText size="sm" color="gray" weight="semibold" mini>Số tiền</UiText>

          <UiFlex @click="startCopy(item.order.money)">
            <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ item.order.money ?
              toMoney(item.order.money)
              : 0 }}</UiText>
            <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
          </UiFlex>
        </UiFlex>

        <UiFlex justify="between">
          <UiText size="sm" color="gray" weight="semibold" mini>Nội dung</UiText>
          <UiFlex @click="startCopy(item.order.code)">
            <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ item.order.code || '...' }}</UiText>
            <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
          </UiFlex>
        </UiFlex>

        <UiFlex justify="center" class="mt-12" v-if="item.order.qrcode">
          <UiImg :src="item.order.qrcode" class="w-[250px] md:max-w-[300px]" />
        </UiFlex>
        <UiFlex justify="end" class="pt-5">
          <UButton color="gray" @click="modal = false">Đóng</UButton>
        </UiFlex>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
const { toMoney } = useMoney()

const route = useRoute();
const loading = ref(false);
const modal = ref(false)
const item = ref<any>({});
const statusFormat = ref<any>({
  0: { label: 'Chờ kích hoạt', color: 'orange' },
  1: { label: 'Đã kích hoạt', color: 'green' },
  2: { label: 'Hết hạn', color: 'primary' },
  3: { label: 'Đã hủy', color: 'red' },
});
const showPassword = ref<any>([]);
const startCopy = (text: any) => {
  if (!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}
const get = async () => {
  try {
    loading.value = true;
    const data = await useAPI("client/service/detail", { _id: route.params.key });
    item.value = data;
    showPassword.value = data.info.map(() => false);
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
const upgrade = async () => {
  useNotify().error('Chúng tôi đang cập nhật, vui lòng quay lại sau')
}
get()
</script>
