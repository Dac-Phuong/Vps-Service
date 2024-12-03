<template>
    <UContainer class="py-10 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <UiText class="text-xl md:text-3xl font-bold text-gray-900 mb-4">
                CÁC TÍNH NĂNG NỔI BẬT
            </UiText>
            <UiText class="text-lg text-gray-600">
                ENI GROUP luôn cập nhật công nghệ hàng đầu để khách hàng có trải nghiệm tốt nhất.
            </UiText>
        </div>
        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <div v-for="(feature, index) in features" :key="index" class="text-center">
                <UiFlex class="flex justify-center mb-4">
                    <UiImg :src="feature.icon" />
                </UiFlex>
                <UiText class="text-lg font-semibold text-gray-900 mb-2">{{ feature.title }}</UiText>
                <UiText class="text-gray-600 max-w-sm mx-auto">{{ feature.description }}</UiText>
            </div>
        </div>
    </UContainer>
</template>

<script setup>

const features = [
    {
        icon: '/images/content/icon-1-content-5.png',
        title: 'Hạ tầng Cloud Storage mạnh mẽ',
        description: 'Cloud VPS Giá Rẻ được triển khai trên hạ tầng Storage cùng với công nghệ lưu trữ SSD Enterprise'
    },
    {
        icon: '/images/content/icon-2-content-5.png',
        title: 'Cài đặt nhanh chóng',
        description: 'Cloud VPS Giá Rẻ của quý khách sẽ sẵn sàng hoạt động trong vòng 1 phút sau khi đăng ký'
    },
    {
        icon: '/images/content/icon-3-content-5.png',
        title: 'Hỗ trợ chống DDoS',
        description: 'Hỗ trợ chống DDoS gồm SYN Flood, Unintentional DDoS, Zero Day DDoS'
    },
    {
        icon: '/images/content/icon-4-content-5.png',
        title: 'Scale Up/Scale down',
        description: 'Quý khách có thể dễ dàng chủ động điều chỉnh thông số của Cloud VPS Giá Rẻ phù hợp với nhu cầu sử dụng'
    },
    {
        icon: '/images/content/icon-5-content-5.png',
        iconClass: 'bg-teal-500 text-white',
        title: 'Trang quản trị dễ dàng',
        description: 'Trang quản trị của chúng tôi được thiết kế đơn giản và thân thiện với người sử dụng'
    },
    {
        icon: '/images/content/icon-6-content-5.png',
        title: 'Công nghệ ảo hóa chuyên nghiệp',
        description: 'Chúng tôi sử dụng công nghệ ảo hóa chuyên nghiệp giúp bạn xây dựng các ứng dụng CNTT và đạt được kết quả nhanh hơn với đỗ trễ thấp'
    }
]
</script>

<style scoped>
.feature-icon {
    transition: transform 0.3s ease;
}

.feature-icon:hover {
    transform: scale(1.1);
}
</style>