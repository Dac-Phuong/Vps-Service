<template>
    <div class="bg-gradient-to-br from-orange-400 via-pink-500 to-primary-400 py-10">
        <UContainer class="p-2">
            <!-- Header Section -->
            <div class="text-center mb-10">
                <UiText class="text-xl md:3xl md:text-4xl font-bold text-black mb-4">
                    NÂNG CẤP CẤU HÌNH CHO VPS
                </UiText>
                <UiText class="text-lg text-black">
                    Mua thêm dịch vụ bổ sung cho Cloud VPS Giá Rẻ của bạn.
                </UiText>
            </div>
            <!-- Grid Layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                <div v-for="(service, index) in services" :key="index"
                    class=" bg-white rounded-lg p-6 shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:border-primary">
                    <div class="text-center">
                        <UiText class="text-lg font-semibold mb-2">
                            {{ service.title }}
                        </UiText>
                        <UiText class="text-3xl text-primary font-bold mb-2">
                            {{ service.price.toLocaleString() }}
                        </UiText>
                        <UiText class="text-gray-500 mb-4">đ/tháng</UiText>
                        <UButton class="w-full justify-center bg-white border-2 border-primary text-black font-semibold py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors">
                            Mua thêm
                        </UButton>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup>
const services = [
    {
        title: 'Mua thêm 50GB SSD',
        price: 200000,
    },
    {
        title: 'Mua thêm 1 GB RAM',
        price: 100000,
    },
    {
        title: 'Đăng ký 01 IP Publish',
        price: 100000,
    },
    {
        title: 'Mua thêm 02 Core',
        price: 100000,
    },
    {
        title: 'Thuê Dịch vụ quản trị',
        price: 330000,
    },
    {
        title: 'Mua thêm 100 Mbps',
        price: 800000,
    },
    {
        title: 'Mua thêm Phần mềm Cpanel',
        price: 650000,
    },
    {
        title: 'Mua thêm Cloud Linux',
        price: 230000,
    }
]
</script>

<style lang="scss" scoped></style>
