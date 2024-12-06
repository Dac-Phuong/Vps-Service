<template>
  <UContainer class="p-2">
    <UBreadcrumb class="mb-3" divider="/"
      :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Quản lý dịch vụ', to: '/service' }, { label: 'Chi tiết dịch vụ' }]" />
    <div v-if="item?.status == 0"
      class="w-full rounded-lg p-3 dark:bg-red-400 dark:bg-opacity-10 text-red-500 dark:text-red-400 bg-red-500 bg-opacity-10 mb-4">
      <UiFlex justify="between">
        <UiText color="red" size="sm">Đơn hàng chưa thanh toán</UiText>
        <UiText class="cursor-pointer" @click="modal.gate = true" color="red" size="sm">Thanh toán ngay</UiText>
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
            <UiText size="sm">Tên máy chủ: </UiText>
            <UiText size="sm" weight="semibold" class="ml-2">{{ item.server || "..." }}</UiText>
          </UiFlex>
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm">Địa chỉ IP : </UiText>
            <UiText size="sm" weight="semibold" class="ml-2">{{ server.ip || "..." }}</UiText>
          </UiFlex>
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm">Tài khoản: </UiText>
            <UiText size="sm" weight="semibold" class="ml-2">{{ server.account || "..." }}</UiText>
          </UiFlex>
          <UiFlex class="mt-2" justify="between">
            <UiText size="sm">Mật khẩu: </UiText>
            <UiFlex>
              <UiText weight="semibold" size="sm" class="ml-2">{{ item.status == 1 && showPassword[index] ?
                server.password : "............." }}</UiText>
              <UiIcon :name="showPassword[index] ? 'i-bxs-hide' : 'i-bxs-show'" color="primary" class="ml-2" pointer
                @click="showPassword[index] = !showPassword[index]" v-if="item.status == 1" />
            </UiFlex>
          </UiFlex>
        </div>
        <UiText size="sm" class="mt-2" v-else color="red">Chưa có thống tin máy chủ</UiText>
      </div>
      <UiFlex class="mt-2">
        <UButton icon="material-symbols:upload-rounded" :disabled="item.status !== 1" @click="modal.upgrade = true"
          color="primary"> Nâng cấp</UButton>
      </UiFlex>
    </UCard>

    <!-- Table -->
    <div class="mt-5">
      <UiText text="Lịch sử nâng cấp" weight="semibold" size="base"  />
      <UCard :ui="{
        body: { padding: 'p-0 sm:p-0' },
        header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
        footer: { padding: 'p-2 sm:p-2' },
      }">
        <template #header>
          <UiFlex>
            <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-1" />
            <UForm :state="page" :submit="getList" class="max-w-[9rem] ml-auto">
              <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"></UInput>
            </UForm>
          </UiFlex>
        </template>

        <LoadingTable v-if="loading" />
        <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
          <template #code-data="{ row }">
            <UiText color="primary" weight="semibold" pointer @click="viewGate(row._id)">{{ row.code }}</UiText>
          </template>

          <template #gate-data="{ row }">
            <UBadge variant="soft" color="gray">{{ row.gate.name }}</UBadge>
          </template>

          <template #server-data="{ row }">
            <UBadge variant="soft" color="gray">{{ row.server.ip }}
            </UBadge>
          </template>
          <template #ram-data="{ row }">
            {{ row.ram }} GB
          </template>
          <template #cpu-data="{ row }">
            {{ row.cpu }} CPU
          </template>
          <template #disk-data="{ row }">
            {{ row.disk }} GB
          </template>
          <template #money-data="{ row }">
            <UiText weight="semibold">{{ toMoney(row.money) }}đ</UiText>
          </template>

          <template #status-data="{ row }">
            <UBadge :color="statusFormat[row.status].color" variant="soft">
              {{ statusFormat[row.status].label }}
            </UBadge>
          </template>

          <template #createdAt-data="{ row }">
            {{ useDayJs().displayFull(row.createdAt) }}
          </template>

          <template #action-data="{ row }">
            <UButton v-if="row.status == 0" color="gray" size="xs" @click="openUndo(row)">Hủy</UButton>
            <span v-if="row.status == 1">...</span>
            <span v-if="row.status == 2">...</span>
          </template>
        </UTable>

        <template #footer>
          <UiFlex justify="end">
            <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
          </UiFlex>
        </template>
      </UCard>
    </div>
    <!-- Gate -->
    <UModal v-model="modal.gate" prevent-close>
      <UCard>
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
            <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ item.order.code || '...' }}
            </UiText>
            <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
          </UiFlex>
        </UiFlex>

        <UiFlex justify="center" class="mt-12" v-if="item.order.qrcode">
          <UiImg :src="item.order.qrcode" class="w-[250px] md:max-w-[300px]" />
        </UiFlex>
        <UiFlex justify="end" class="pt-5">
          <UButton color="gray" @click="modal.gate = false">Đóng</UButton>
        </UiFlex>
      </UCard>
    </UModal>
    <!-- Upgrade -->
    <UModal v-model="modal.upgrade" prevent-close>
      <UCard>
        <UForm :state="state">
          <UFormGroup :label="`CPU (${toMoney(state.cpu)} CPU) `" name="cpu">
            <URange :step="0" :min="0" :max="100" v-model="state.cpu" />
          </UFormGroup>
          <UFormGroup :label="`RAM (${toMoney(state.ram)} GB)`" name="ram">
            <URange :step="0" :min="0" :max="100" v-model="state.ram" />
          </UFormGroup>
          <UFormGroup :label="`Disk (${toMoney(state.disk)} GB)`" name="disk">
            <URange :step="0" :min="0" :max="500" v-model="state.disk" />
          </UFormGroup>
          <UFormGroup label="Chọn IP máy chủ" name="server">
            <USelectMenu :loading="loading" v-model="state.server" :disabled="item.info.length === 0"
              :options="item.info" placeholder="Chọn IP máy chủ" option-attribute="ip">
              <template #option="{ option: person }">
                <UiText class="truncate">{{ person.ip }}</UiText>
              </template>
            </USelectMenu>
          </UFormGroup>
          <div class="border-t py-2 border-gray-200 dark:border-gray-800">
            <UiText size="sm" weight="semibold" mini>Thông tin cấu hình</UiText>
            <UiFlex justify="between" class="mt-2">
              <UiText size="sm" color="gray" weight="semibold">CPU</UiText>
              <UiText size="sm" align="right">{{ toMoney(state.cpu) }} CPU</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mt-2">
              <UiText size="sm" color="gray" weight="semibold">RAM</UiText>
              <UiText size="sm" align="right">{{ toMoney(state.ram) }} GB</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mt-2">
              <UiText size="sm" color="gray" weight="semibold">Disk</UiText>
              <UiText size="sm" align="right">{{ toMoney(state.disk) }} GB</UiText>
            </UiFlex>
          </div>
          <div class="border-t py-2 border-gray-200 dark:border-gray-800">
            <UiText size="sm" weight="semibold" mini>Phương thức thanh toán</UiText>
            <div v-if="gate && gate.length" class="grid-cols-12 grid gap-2 mt-3">
              <div v-for="(item, index) in gate" :key="index" @click="getOption(item, index)"
                :class="['grid col-span-6 md:col-span-3 h-16 flex flex-col justify-center items-center rounded-lg border relative cursor-pointer', index === state.index ? 'border-primary' : 'border-gray-200 dark:border-gray-600']">
                <div class="absolute top-0 right-2">
                  <UiIcon size="6" color="primary" name="iconamoon:check-bold" v-if="index === state.index" />
                </div>
                <UiText size="sm" class="text-center" color="gray" weight="semibold">{{ item.name }}</UiText>
              </div>
            </div>
            <UiText v-else text="Chưa có phương thức thanh toán" size="sm" color="red" />
            <div v-if="state.gate">
              <UiText text="Thông tin thanh toán" weight="semibold" size="sm"
                class="py-3 border-b border-gray-200 dark:border-gray-800" />
              <UiFlex justify="between" class="my-4">
                <UiText size="sm" color="gray" weight="semibold">Kênh</UiText>
                <UiText size="sm" weight="semibold">{{ state.gate.name || "..." }}</UiText>
              </UiFlex>
              <UiFlex justify="between" class="mb-4">
                <UiText size="sm" color="gray" weight="semibold" mini>Người nhận</UiText>
                <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ state.gate.person || "..." }}</UiText>
              </UiFlex>
              <UiFlex justify="between" class="mb-4">
                <UiText size="sm" color="gray" weight="semibold" mini>Số tài khoản</UiText>
                <UiFlex @click="startCopy(state.gate.number)">
                  <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ state.gate.number }}
                  </UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>
              <UiFlex justify="between" class="mb-4">
                <UiText size="sm" color="gray" weight="semibold" mini>Số tiền</UiText>
                <UiFlex
                  @click="startCopy(useMoney().toMoney((state.cpu * product.cpu) + (state.ram * product.ram) + (state.disk * product.disk)))">
                  <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{
                    useMoney().toMoney((state.cpu * product.cpu) + (state.ram * product.ram) + (state.disk *
                      product.disk)) }}</UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>
              <UiFlex justify="between" class="mb-4">
                <UiText size="sm" color="gray" weight="semibold" mini>Nội dung</UiText>
                <UiFlex @click="startCopy(state.code)">
                  <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ state.code }}</UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>
            </div>
          </div>
          <UiFlex justify="end" class="pt-5">
            <UButton color="gray" @click="modal.upgrade = false">Đóng</UButton>
            <UButton color="primary" class="ml-2" @click="upgrade">Hoàn tất</UButton>
          </UiFlex>
        </UForm>
      </UCard>
    </UModal>
  </UContainer>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
const toast = useToast()
const { toMoney } = useMoney()
const { product } = useConfigStore().config;
const route = useRoute();
const loading = ref(false);
const item = ref<any>({});
const gate = ref<any[]>([]);
const showPassword = ref<any>([]);
const list = ref<any[]>([]);
const modal = ref({
  gate: false,
  upgrade: false,
})

const state = ref<any>({
  service: route.params.key,
  cpu: 0,
  ram: 0,
  disk: 0,
  gate: null,
  server: undefined,
  index: 0,
  code: "Upgrade-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
})

const statusFormat = ref<any>({
  0: { label: 'Chưa duyệt', color: 'orange' },
  1: { label: 'Hoàn thành', color: 'green' },
  2: { label: 'Đã hủy', color: 'red' },
});

const page = ref<any>({
  _id: route.params.key,
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'code'
  },
  total: 0,
})
const columns = [
  {
    key: 'code',
    label: 'Mã',
  }, {
    key: 'server',
    label: 'IP máy chủ',
  }, {
    key: 'money',
    label: 'Số tiền',
    sortable: true
  }, {
    key: 'status',
    label: 'Trạng thái',
  },
  {
    key: 'ram',
    label: 'RAM',
  },
  {
    key: 'cpu',
    label: 'CPU',
  },
  {
    key: 'disk',
    label: 'DISK',
  },
  {
    key: 'createdAt',
    label: 'Thời gian tạo',
    sortable: true
  },
  {
    key: 'action',
    label: 'Hành động',
  }
]
const startCopy = (text: string) => {
  if (!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}
const getOption = (data: any, index: number) => {
  state.value.index = index
  state.value.gate = data
};
const validate = (state: any) => {
  if (state.cpu === 0 && state.ram === 0 && state.disk === 0) {
    toast.add({
      color: 'red',
      title: 'Thông báo',
      description: 'Vui lòng chọn thông số nâng cấp',
    })
    return false
  }

  if (state.server === undefined) {
    toast.add({
      color: 'red',
      title: 'Thông báo',
      description: 'Vui lòng chọn máy chủ',
    })
    return false
  }
  return true
}
watch(() => modal.value.upgrade, () => {
  state.value.cpu = 0
  state.value.ram = 0
  state.value.disk = 0
  state.value.server = undefined
  state.value.code = "Upgrade-" + Math.random().toString(36).substring(2, 6).toUpperCase();
})
const get = async () => {
  try {
    loading.value = true;
    const data = await useAPI("client/service/detail", { _id: route.params.key });
    item.value = data.service;
    gate.value = data.gate
    state.value.gate = data.gate[0]
    showPassword.value = data.info.map(() => false);
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
const upgrade = async () => {
  if (!validate(state.value)) return
  try {
    loading.value = true;
    await useAPI("client/service/upgrade", JSON.parse(JSON.stringify(state.value)));
    loading.value = false;
    modal.value.upgrade = false
  } catch (error) {
    loading.value = false;
  }
}
const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('client/service/upgrade/list', JSON.parse(JSON.stringify(page.value)))
    loading.value = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value = false
  }
}

nextTick(async () => {
  await get()
  await getList()
})
</script>
