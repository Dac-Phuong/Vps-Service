<template>
  <UiContent title="Upgrade" sub="Quản lý nâng cấp VPS">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-auto" />
      <UForm :state="page" @submit="getList" class="mr-1">
        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
      </UForm>
    </UiFlex>

    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />
      <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
        <template #code-data="{ row }">
          <UiText weight="semibold" color="primary" pointer @click="viewOrder(row._id)">{{ row.code }}</UiText>
        </template>
        <template #service-data="{ row }">
          <UBadge weight="semibold" color="primary" class="cursor-pointer" variant="soft" @click="viewVps(row.server)">
            Xem</UBadge>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>
        <template #money-data="{ row }">
          {{ useMoney().toMoney(row.money) }} đ
        </template>
        <template #type-data="{ row }">
          <UBadge :color="row.type == 1 ? 'primary' : 'gray'" variant="soft">
            {{ row.type == 1 ? 'Gói gia hạn' : 'Gói nâng cấp' }}
          </UBadge>
        </template>
        <template #option-data="{ row }">
          {{ row.type == 1 ? `${useMoney().toMoney(row.option.price)} / ${row.option.number} Tháng` : `RAM: (${row.option.ram} GB), CPU: (${row.option.cpu} CORE), DISK: (${row.option.disk} GB)` }}
        </template>
        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <UForm :state="state" @submit="editAction" class="p-4">
        <UiFlex justify="between" class="mb-4">
          <UiText size="base" weight="semibold" color="gray" text="Thông tin VPS" />
        </UiFlex>
        <UiFlex class="align-center" v-for="(item, index) in state.info" :key="index">
          <UInput v-model="item.ip" class="w-3/4 mb-2" required placeholder="Địa chỉ IP" />
          <UInput v-model="item.account" class="w-2/4 mb-2 ml-2" required placeholder="Tài khoản" />
          <UInput v-model="item.password" class="w-2/4 mb-2 ml-2" required placeholder="Mật khẩu" />
          <UButton type="button" icon="i-heroicons-trash" @click="state.info.splice(index, 1)" color="red"
            class="ml-2 mb-2 w-[40px] h-[40px] flex items-center justify-center" />
        </UiFlex>

        <UiFlex class="mt-4 align-center">
          <UButton type="button" size="sm" @click="state.info.push({ key: '', value: '' })" color="primary"
            class="ml-2 mt-2 flex items-center justify-center">Thêm</UButton>
          <UiFlex class="ml-auto">
            <UButton type="submit" :loading="loading.edit">Lưu</UButton>
            <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UiFlex>
      </UForm>
    </UModal>
    <!-- Modal Success -->
    <UModal v-model="modal.success" preventClose>
      <UCard class="p-0">
        <UForm :state="stateSuccess" @submit="confirmAction">
          <UFormGroup label="Mã giao dịch">
            <UInput :model-value="stateSuccess.code" readonly />
          </UFormGroup>

          <UFormGroup label="Số tiền thực nhận">
            <UInput v-model="stateSuccess.money" type="number" />
          </UFormGroup>

          <UiFlex justify="end" class="mt-6">
            <UButton type="submit" :loading="loading.success">Duyệt</UButton>
            <UButton color="gray" @click="modal.success = false" :disabled="loading.success" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UCard>
    </UModal>
    <!-- Modal cancel -->
    <UModal v-model="modal.cancel" preventClose>
      <UCard class="p-0">
        <UForm :state="stateCancel" @submit="cancelAction">
          <UFormGroup label="Mã giao dịch">
            <UInput :model-value="stateCancel.code" readonly />
          </UFormGroup>

          <UFormGroup label="Lý do từ chối">
            <UTextarea v-model="stateCancel.reason" />
          </UFormGroup>

          <UiFlex justify="end" class="mt-6">
            <UButton type="submit" :loading="loading.success">Xác nhận</UButton>
            <UButton color="gray" @click="modal.cancel = false" :disabled="loading.cancel" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UCard>
    </UModal>
    <!-- Modal show -->
    <UModal v-model="modal.show">
      <UCard class="p-0">
        <UiText size="base" class="mb-2" weight="semibold" color="gray" text="Thông tin VPS" />
        <div class="border mb-2 rounded-lg p-2 border-gray-200 dark:border-gray-800" v-if="server">
          <UiFlex justify="between w-full" class="py-1">
            <UiText size="sm" weight="semibold" color="gray" text="Địa chỉ IP:" />
            <UiFlex @click="startCopy(server.ip)">
              <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ server.ip }}</UiText>
              <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
            </UiFlex>
          </UiFlex>
          <UiFlex justify="between w-full" class="py-1">
            <UiText size="sm" weight="semibold" color="gray" text="Tài khoản:" />
            <UiFlex @click="startCopy(server.account)">
              <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ server.account }}</UiText>
              <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
            </UiFlex>
          </UiFlex>
          <UiFlex justify="between w-full" class="py-1">
            <UiText size="sm" weight="semibold" color="gray" text="Mật khẩu:" />
            <UiFlex @click="startCopy(server.password)">
              <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ server.password }}</UiText>
              <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
            </UiFlex>
          </UiFlex>
        </div>
        <UiText v-else size="sm" class="mb-2" color="red" text="Chưa có thông tin máy chủ" />
        <UiFlex justify="end" class="mt-3">
          <UButton color="gray" @click="modal.show = false" class="ml-1 border border-gray-200 dark:border-gray-800">
            Đóng
          </UButton>
        </UiFlex>
      </UCard>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([]);
const stateOrder = ref(undefined)
const server = ref(undefined)
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
// Columns
const columns = [
  {
    key: "code",
    label: "Mã giao dịch",
  },
  {
    key: "user.account",
    label: "Khách hàng",
  },
  {
    key: "gate.name",
    label: "Kênh thanh toán",
  },
  {
    key: "service",
    label: "VPS",
  },
  {
    key: "money",
    label: "Số tiền",
    sortable: true
  },
  {
    key: "status",
    label: "Trạng thái",
    sortable: true
  },
  {
    key: "type",
    label: "Kiểu nâng cấp",
  },
  {
    key: "option",
    label: "Thông tin nâng cấp",
  },
  {
    key: "createdAt",
    label: "Thời gian tạo",
    sortable: true
  },
  {
    key: "actions",
    label: "Chức năng",
  },
];
const selectedColumns = ref([...columns]);

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: "updatedAt",
    direction: "desc",
  },
  search: {
    key: null,
    by: 'CODE'
  },
  total: 0,
});

// State
const stateSuccess = ref({
  _id: null,
  code: null,
  money: null,
})
const stateCancel = ref({
  _id: null,
  code: null,
  money: null,
  reason: null,
})
const statusFormat = {
  0: { label: 'Chưa duyệt', color: 'orange' },
  1: { label: 'Hoàn thành', color: 'green' },
  2: { label: 'Đã hủy', color: 'red' },
}
// Modal
const modal = ref({
  edit: false,
  success: false,
  refuse: false,
  cancel: false,
  show: false,
});
// Loading
const loading = ref({
  load: true,
  cancel: false,
  edit: false,
});
const viewOrder = (_id) => {
  stateOrder.value = _id
  modal.value.order = true
}
const viewVps = (item) => {
  server.value = item
  modal.value.show = true
}
const startCopy = (text) => {
  if (!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}

// Actions
const actions = (row) => [
  [{
    label: 'Duyệt',
    icon: 'i-bx-check',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateSuccess.value).forEach(key => stateSuccess.value[key] = row[key])
      modal.value.success = true
    }
  }], [{
    label: 'Từ chối',
    icon: 'i-bx-x',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateCancel.value).forEach(key => stateCancel.value[key] = row[key])
      modal.value.cancel = true
      stateCancel.value.code = row.code
    }
  }], [{
    label: 'Chưa duyệt',
    icon: 'i-bx-redo',
    disabled: row.status == 0,
    click: () => {
      waitingAction(row._id)
    }
  }]
]
watch(() => page.value.size, () => getList());
watch(() => page.value.current, () => getList());
watch(() => page.value.sort.column, () => getList());
watch(() => page.value.sort.direction, () => getList());
watch(() => page.value.search.key, (val) => !val && getList())

// Fetch
const getList = async () => {
  try {
    loading.value.load = true;
    const data = await useAPI("admin/service/upgrade/list", JSON.parse(JSON.stringify(page.value)));
    loading.value.load = false;
    list.value = data.list;
    page.value.total = data.total;
  } catch (e) {
    loading.value.load = false;
  }
};
const confirmAction = async () => {
  try {
    loading.value.success = true
    await useAPI('admin/service/upgrade/confirm', JSON.parse(JSON.stringify(stateSuccess.value)))
    loading.value.success = false
    modal.value.success = false
    getList()
  }
  catch (e) {
    loading.value.success = false
  }
}

const cancelAction = async () => {
  try {
    loading.value.cancel = true
    await useAPI('admin/service/upgrade/cancel', JSON.parse(JSON.stringify(stateCancel.value)))
    loading.value.cancel = false
    modal.value.cancel = false
    getList()
  }
  catch (e) {
    loading.value.refuse = false
  }
}

const waitingAction = async (_id) => {
  try {
    loading.value.waiting = true
    await useAPI('admin//service/upgrade/waiting', { _id })
    loading.value.waiting = false
    modal.value.waiting = false
    getList()
  }
  catch (e) {
    loading.value.waiting = false
  }
}
getList();
</script>
