<template>
    <UContainer class="p-2">
        <UBreadcrumb class="mb-5" divider="/" :links="[{ label: 'Trang chủ', to: '/' }, { label: 'Dịch vụ' }]" />
        <UCard v-if="!!authStore.isLogin">
            <UiFlex class="mb-4">
                <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-auto border border-gray-200 dark:border-gray-800 rounded-xl" />
                <UForm :state="page" @submit="getList" class="mr-1">
                    <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"
                        class="mr-1 border border-gray-200 dark:border-gray-800 rounded-xl" />
                </UForm>
            </UiFlex>

            <!-- Table -->
            <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
                <LoadingTable v-if="loading.load" />
                <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
                    <template #createdAt-data="{ row }">
                        {{ useDayJs().displayFull(row.createdAt) }}
                    </template>
                    <template #product.name-data="{ row }">
                        <UBadge variant="soft" color="primary" class="cursor-pointer"
                            @click="router.push(`/service/${row._id}`)">{{ row.product.name }}</UBadge>
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
                </UTable>
            </UCard>
            <!-- Pagination -->
            <UiFlex justify="between" class="py-4">
                <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
                <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
            </UiFlex>
        </UCard>
        <UiAuth v-else title="Vui lòng đăng nhập" />
    </UContainer>
</template>

<script setup>
useSeoMeta({
  title: () => "Dịch vụ - ENI",
  ogTitle: () => "Dịch vụ - ENI"
})
// List
const list = ref([]);
const router = useRouter();
const authStore = useAuthStore();

// Columns
const columns = [
    {
        key: "product.name",
        label: "Gói đăng ký",
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
        by: 'PRODUCT'
    },
    total: 0,
});

// State
const state = ref({
    _id: null,
    info: [{
        ip: null,
        password: null
    }],
});
const statusFormat = {
    0: { label: 'Chờ kích hoạt', color: 'gray' },
    1: { label: 'Đã kích hoạt', color: 'green' },
    2: { label: 'Hết hạn', color: 'primary' },
    3: { label: 'Đã hủy', color: 'primary' },
    4: { label: 'Sắp hết hạn', color: 'orange' },
}
// Modal
const modal = ref({
    edit: false,
});

watch(() => modal.value.edit, (val) => !val &&
    (state.value = {
        _id: null,
        info: [{ ip: null, password: null }],
    })
);

// Loading
const loading = ref({
    load: false,
    edit: false,
});

// Actions
watch(() => page.value.size, () => getList());
watch(() => page.value.current, () => getList());
watch(() => page.value.sort.column, () => getList());
watch(() => page.value.sort.direction, () => getList());
watch(() => page.value.search.key, (val) => !val && getList())

// Fetch
const getList = async () => {
    if (!authStore.isLogin) return
    try {
        loading.value.load = true;
        const data = await useAPI("client/service/list", JSON.parse(JSON.stringify(page.value)));
        loading.value.load = false;
        list.value = data.list;
        page.value.total = data.total;
    } catch (e) {
        loading.value.load = false;
    }
};
getList();
</script>