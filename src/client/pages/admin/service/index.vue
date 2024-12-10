<template>
  <UiContent title="Service" sub="Quản lý dịch vụ">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-auto" />
      <UForm :state="page" @submit="getList" class="mr-1">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'PRODUCT']" />
        </UiFlex>
      </UForm>
    </UiFlex>

    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>
        <template #number-data="{ row }">
          {{ row.number || '...' }} Tháng
        </template>

        <template #end_time-data="{ row }">
          {{ row.end_time ? useDayJs().displayFull(row.end_time) : '...' }}
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
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

  </UiContent>
</template>

<script setup>
// List
const list = ref([]);
// Columns
const columns = [
  {
    key: "user.account",
    label: "Khách hàng",
  },
  {
    key: "product.name",
    label: "Tên VPS",
  },
  {
    key: "os.name",
    label: "Hệ điều hành",
  },
  {
    key: "server",
    label: "Tên máy chủ",
  }, {
    key: "status",
    label: "Trạng thái",
    sortable: true
  },
  {
    key: "number",
    label: "Thời gian thuê",
    sortable: true
  },
  {
    key: "quantity",
    label: "Số lượng",
    sortable: true
  },
  {
    key: "createdAt",
    label: "Bắt đầu",
    sortable: true
  },
  {
    key: "end_time",
    label: "Hết hạn",
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
    by: 'USER'
  },
  total: 0,
});

// State
const state = ref({
  _id: null,
  info: [{
    ip: null,
    password: null,
    account: null
  }],
});
const statusFormat = {
    0: { label: 'Chưa kích hoạt', color: 'orange' },
    1: { label: 'Đã kích hoạt', color: 'green' },
    2: { label: 'Hết hạn', color: 'primary' },
    3: { label: 'Đã hủy', color: 'red' },
    4: { label: 'Sắp hết hạn', color: 'orange' },
  }
// Modal
const modal = ref({
  edit: false,
});
watch(() => modal.value.edit, (val) => !val &&
  (state.value = {
    _id: null,
    info: [{ ip: null,account: null, password: null }],
  })
);

// Loading
const loading = ref({
  load: true,
  edit: false,
});

// Actions
const actions = (row) => [
  [
    {
      label: "Thông tin VPS",
      icon: "i-bx-pencil",
      click: () => {
        state.value._id = row._id;
        state.value.info = row.info.length > 0 ? JSON.parse(JSON.stringify(row.info)) : [{ ip: null,account: null, password: null }];
        modal.value.edit = true;
      },
    },
  ],
];
watch(() => page.value.size, () => getList());
watch(() => page.value.current, () => getList());
watch(() => page.value.sort.column, () => getList());
watch(() => page.value.sort.direction, () => getList());
watch(() => page.value.search.key, (val) => !val && getList())

// Fetch
const getList = async () => {
  try {
    loading.value.load = true;
    const data = await useAPI("admin/service/list", JSON.parse(JSON.stringify(page.value)));
    loading.value.load = false;
    list.value = data.list;
    page.value.total = data.total;
  } catch (e) {
    loading.value.load = false;
  }
};
const editAction = async () => {
  try {
    loading.value.edit = true;
    await useAPI("admin/service/edit", JSON.parse(JSON.stringify(state.value)));
    loading.value.edit = false;
    modal.value.edit = false;
    getList();
  } catch (e) {
    loading.value.edit = false;
  }
};

getList();
</script>
