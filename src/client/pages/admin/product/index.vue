<template>
  <UiContent title="Product" sub="Quản lý các sản phẩm" >
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-auto" />
      <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>

    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
        <template #category-data="{ row }">
          <UBadge :color="row.category.color" variant="soft">{{
            row.category.name
          }}</UBadge>
        </template>

        <template #title-data="{ row }">
          <UiText class="min-w-[200px] max-w-[200px] whitespace-normal">{{
            row.title
          }}</UiText>
        </template>

        <template #show-data="{ row }">
          <UBadge class="cursor-pointer" variant="soft" color="red" @click="viewSpecs(row.specs)">Xem</UBadge>
        </template>

        <template #price-data="{ row }">
          <UBadge class="cursor-pointer" variant="soft" color="red" @click="viewPrice(row)">Xem</UBadge>
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="row.pin == 1 ? 'green' : 'gray'" variant="soft">{{ row.pin == 1 ? "Đã ghim" : "Không" }}
          </UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display == 1 ? 'green' : 'gray'" variant="soft">{{ row.display == 1 ? "Hiện" : "Ẩn" }}
          </UBadge>
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

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Danh mục">
          <SelectCategory v-model="stateAdd.category" />
        </UFormGroup>

        <UFormGroup label="Tên sản phẩm">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Giá sản phẩm">
          <UInput v-model="stateAdd.price" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="between" class="mb-2">
          <UiText size="sm" weight="semibold" color="gray" text="Thông số sản phẩm" />
          <UButton type="button" size="sm" icon="i-heroicons-plus" @click="stateAdd.specs.push({ key: '', value: '' })"
            color="primary" class="ml-2 mt-2 w-[40px] h-[40px] flex items-center justify-center" />
        </UiFlex>
        <UiFlex class="align-center" v-for="(item, index) in stateAdd.specs" :key="index">
          <UInput v-model="item.key" required class="w-2/5" />
          <UInput v-model="item.value" required class="w-full ml-2" />
          <UButton type="button" icon="i-heroicons-trash" @click="stateAdd.specs.splice(index, 1)" color="red"
            class="ml-2 mt-2 w-[40px] h-[40px] flex items-center justify-center" />
        </UiFlex>

        <UiFlex class="mt-6">
          <UButton class="ml-auto" type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Danh mục">
          <SelectCategory v-model="stateEdit.category" />
        </UFormGroup>

        <UFormGroup label="Tên sản phẩm">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <UFormGroup label="Giá sản phẩm">
          <UInput v-model="stateEdit.price" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="between" class="mb-2">
          <UiText size="sm" weight="semibold" color="gray" text="Thông số sản phẩm" />
          <UButton type="button" size="sm" icon="i-heroicons-plus" @click="stateEdit.specs.push({ key: '', value: '' })"
            color="primary" class="ml-2 mt-2 w-[40px] h-[40px] flex items-center justify-center" />
        </UiFlex>
        <UiFlex class="align-center" v-for="(item, index) in stateEdit.specs" :key="index">
          <UInput v-model="item.key" required class="w-2/5" />
          <UInput v-model="item.value" required class="w-full ml-2" />
          <UButton type="button" icon="i-heroicons-trash" @click="stateEdit.specs.splice(index, 1)" color="red"
            class="ml-2 mt-2 w-[40px] h-[40px] flex items-center justify-center" />
        </UiFlex>

        <UiFlex class="mt-6">
          <UButton class="ml-auto" type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
    <!-- Modal Price -->
    <UModal v-model="modal.price" preventClose>
      <UForm :state="statePrice" @submit="priceAction" class="p-4">
        <UiFlex class="align-center" v-for="(item, index) in options" :key="index">
          <UFormGroup label="Tháng" class="w-1/4">
            <UInput type="number" v-model="item.number" :min="0" step="0.01" required />
          </UFormGroup>
          <UFormGroup label="Giá thuê/tháng" class="w-full ml-2">
            <UInput v-model="item.price" type="number" :min="0" step="0.01" required />
          </UFormGroup>
          <UButton type="button" icon="i-heroicons-trash" @click="options.splice(index, 1)" color="red"
            class="ml-2 mt-2 w-[40px] h-[40px] flex items-center justify-center" />
        </UiFlex>
        <UiFlex justify="between" class="mt-4">
          <UButton type="button" @click="options.push({ ...statePrice.value })">Thêm</UButton>
          <UiFlex>
            <UButton type="submit" :loading="loading.price" class="ml-1">Lưu</UButton>
            <UButton color="gray" @click="modal.price = false" :disabled="loading.price" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UiFlex>
      </UForm>
    </UModal>
    <!-- Modal show -->
    <UModal v-model="modal.show">
      <div class="p-4">
        <UiText text="Thông số kỹ thuật" weight="semibold" size="lg" class="mb-3" />
        <UiFlex class="align-center border border-gray-200 rounded-lg dark:border-gray-800 p-2 mb-2" v-for="(item, index) in dataShow" :key="index">
          <UiText class="w-2/5 font-semibold" size="sm" >{{item.key}} :</UiText>
          <UiText :text="item.value" class="w-full ml-2" size="sm" />
        </UiFlex>
        <div class="w-full flex justify-end">
          <UButton color="gray" @click="modal.show = false" class="ml-auto border border-gray-200 dark:border-gray-800">Đóng</UButton>
        </div>
      </div>
    </UModal>
    <!-- Modal show -->
    <UModal v-model="modal.options">
      <div class="p-4">
        <UiText text="Giá thuê/tháng" weight="semibold" size="lg" class=" mb-3" />
        <UiFlex v-if="dataPrice && dataPrice.length > 0" class="align-center border border-gray-200 rounded-lg dark:border-gray-800 p-2 mb-2" v-for="(item, index) in dataPrice" :key="index">
          <UiText class="w-2/5 font-semibold" size="sm" >{{item.number}} Tháng :</UiText>
          <UiText class="w-full ml-2" size="sm">{{ useMoney().toMoney(item.price) }}đ</UiText>
        </UiFlex>
        <div v-else>
          <UiText text="Chưa có giá thuê"  color="red" weight="semibold" size="sm" class="m-1 mb-3" />
        </div>
        <div class="w-full flex justify-end">
          <UButton color="gray" @click="modal.options = false" class="ml-auto border border-gray-200 dark:border-gray-800">Đóng</UButton>
        </div>
      </div>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([]);
const options = ref([]);
const dataShow = ref([]);
const dataPrice = ref([]);
// Columns
const columns = [
  {
    key: "name",
    label: "Tên sản phẩm",
  },
  {
    key: "show",
    label: "Thông số",
  },
  {
    key: "price",
    label: "Giá thuê/Tháng",
  },
  {
    key: "category",
    label: "Danh mục",
  },
  {
    key: "display",
    label: "Hiển thị",
    sortable: true,
  },
  {
    key: "updatedAt",
    label: "Cập nhật",
    sortable: true,
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
  total: 0,
});

// State
const stateAdd = ref({
  category: null,
  name: null,
  specs: [
    { key: "CPU", value: "" },
    { key: "RAM", value: "" },
    { key: "SSD", value: "" },
    { key: "IOPS", value: "" },
    { key: "OS", value: "" },
  ],
  price: null,
  pin: false,
  display: true,
});
const stateEdit = ref({
  _id: null,
  category: null,
  name: null,
  specs: [],
  price: null,
  pin: null,
  display: null,
});

const statePrice = ref({
  price: null,
  number: undefined,
});
const productId = ref(null);
// Modal
const modal = ref({
  add: false,
  edit: false,
  price: false,
  options: false,
  show: false
});

watch(() => modal.value.add,(val) =>!val && (stateAdd.value = {
      category: null,
      name: null,
      specs: [
        { key: "CPU", value: "" },
        { key: "RAM", value: "" },
        { key: "SSD", value: "" },
        { key: "IOPS", value: "" },
        { key: "OS", value: "" },
      ],
      pin: false,
      display: true,
    })
);

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
  content: false,
});
const viewSpecs = (data) => {
  dataShow.value = data;
  modal.value.show = true
}
const viewPrice = (data) => {
  dataPrice.value = data.options;
  modal.value.options = true
}
// Actions
const actions = (row) => [
  [
    {
      label: "Xem trực tiếp",
      icon: "i-bx-link-external",
      click: () => window.open(`/product/${row.key}`, "_blank"),
    },
  ],
  [
    {
      label: "Sửa thông tin",
      icon: "i-bx-pencil",
      click: () => {
        Object.keys(stateEdit.value).forEach((key) => (stateEdit.value[key] = row[key]));
        stateEdit.value.specs = JSON.parse(JSON.stringify(row.specs));
        stateEdit.value.category = row.category._id;
        modal.value.edit = true;
      },
    },
    {
      label: "Sửa giá tiền",
      icon: "solar:dollar-bold",
      click: async () => {
        try {
          options.value = row.options.length > 0 ? row.options : [{ price: 0, number: 1 }];
          modal.value.price = true;
          productId.value = row._id;
        } catch (e) {
          return;
        }
      },
    },
  ],
  [
    {
      label: "Xóa sản phẩm",
      icon: "i-bx-trash",
      click: () => delAction(row._id),
    },
  ],
];
watch(
  () => page.value.size,
  () => getList()
);
watch(
  () => page.value.current,
  () => getList()
);
watch(
  () => page.value.sort.column,
  () => getList()
);
watch(
  () => page.value.sort.direction,
  () => getList()
);
// Fetch
const getList = async () => {
  try {
    loading.value.load = true;
    const data = await useAPI(
      "admin/product/list",
      JSON.parse(JSON.stringify(page.value))
    );

    loading.value.load = false;
    list.value = data.list;
    page.value.total = data.total;
  } catch (e) {
    loading.value.load = false;
  }
};

const addAction = async () => {
  try {
    loading.value.add = true;
    await useAPI(
      "admin/product/add",
      JSON.parse(JSON.stringify(stateAdd.value))
    );

    loading.value.add = false;
    modal.value.add = false;
    getList();
  } catch (e) {
    loading.value.add = false;
  }
};

const editAction = async () => {
  try {
    loading.value.edit = true;
    await useAPI(
      "admin/product/edit",
      JSON.parse(JSON.stringify(stateEdit.value))
    );

    loading.value.edit = false;
    modal.value.edit = false;
    getList();
  } catch (e) {
    loading.value.edit = false;
  }
};

const delAction = async (_id) => {
  try {
    loading.value.del = true;
    await useAPI("admin/product/del", { _id });
    loading.value.del = false;
    getList();
  } catch (e) {
    loading.value.del = false;
  }
};


const priceAction = async () => {
  try {
    loading.value.price = true;
    await useAPI("admin/product/options/edit", { options: JSON.parse(JSON.stringify(options.value)),_id: productId.value});
    loading.value.price = false;
    modal.value.price = false;
    getList();
  } catch (e) {
    loading.value.price = false;
  }
};
getList();
</script>
