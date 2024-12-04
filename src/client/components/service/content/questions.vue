<template>
    <UContainer class="p-2">
        <UiText class="text-xl md:text-3xl text-center font-bold uppercase text-gray-900 mb-4">
            Các câu hỏi thường gặp
        </UiText>
        <UAccordion :items="faqItems" :ui="{
            wrapper: 'space-y-2',
            item: {
                base: 'ml-3 p-2',
                trigger: {
                    base: 'w-full flex items-center justify-between text-left hover:bg-gray-50',
                    active: 'bg-blue-50',
                    inactive: 'bg-white'
                },
                content: 'bg-white'
            }
        }">
            <template #default="{ item, open, toggle }">
                <UButton :ui="{
                    base: 'w-full flex items-center justify-between text-left',
                    variant: { solid: '', outline: '', soft: '', ghost: '', link: '' },
                }" @click="toggle">
                    <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-bookmark" class="flex-shrink-0 w-5 h-5 text-blue-500" />
                        <span class="text-gray-900">{{ item.title }}</span>
                    </div>
                    <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                        class="flex-shrink-0 w-5 h-5 text-gray-500" />
                </UButton>
            </template>
            <template #content="{ item }">
                <p class="text-gray-200">{{ item.content }}</p>
            </template>
        </UAccordion>
    </UContainer>
</template>
<script setup lang="ts">
const faqItems = [
    {
        title: 'ENI Group cung cấp những dịch vụ gì?',
        defaultOpen: true,
        content: 'ENI Group là đơn vị cung cấp Hosting, VPS, Server tốc độ cao, chuyên nghiệp tại thị trường Việt Nam.'
    }, {
        title: 'ENI Group sẽ hỗ trợ kỹ thuật cho tôi như thế nào?',
        content: 'ENI Group có riêng đội ngũ tư vấn và hỗ trợ kỹ thuật chuyên nghiệp giúp khách hàng giải quyết được các vấn đề phát sinh một cách nhanh gọn nhất, không làm ảnh hưởng đến hiệu suất công việc. Đội ngũ nhân viên của chúng tôi với kinh nghiệm và trình độ chuyên môn cao sẵn sàng hỗ trợ khách hàng 24/7, mang đến cho khách hàng trải nghiệm tốt nhất khi sử dụng dịch vụ tại ENI Group.'
    }, {
        title: 'Tôi có thể liên hệ với ENI Group bằng cách nào?',
        content: 'ENI Group có hệ thống các kênh liên lạc đa dạng giúp bạn dễ dàng kết nối được với chúng tôi. Bạn có thể liên hệ với ENI Group qua Fanpage Facebook, Livechat, Ticket, Email,…Ngoài ra, trong trường hợp cần hỗ trợ nhanh chóng, bạn có thể gọi đến hotline: 1800 1093 để được giải quyết kịp thời.'
    }, {
        title: 'ENI Group có đảm bảo bảo mật an toàn các thông tin cá nhân và dữ liệu của tôi không?',
        content: 'Đảm bảo an toàn và bảo mật thông tin của Quý khách hàng là nhiệm vụ ENI Group luôn đặt lên hàng đầu. Chúng tôi sẽ không xâm phạm vào thông tin và dữ liệu của khách hàng khi chưa được cho phép. ENI Group cam kết không chia sẻ thông tin khách hàng dưới bất kỳ hình thức nào cho bên thứ ba. Mọi hoạt động sẽ tuân thủ đúng pháp luật, điều khoản hợp đồng và Chính sách bảo mật thông tin của chúng tôi.'
    }, {
        title: 'Tôi muốn nâng cấp dịch vụ thì bằng cách nào?',
        content: 'Khi có nhu cầu nâng cấp dịch vụ, Quý khách có thể tiến hành nâng cấp trực tiếp một cách nhanh chóng thông qua trang quản trị dịch vụ của ENI Group. Số tiền và thời gian sử dụng tương ứng sẽ được hệ thống tự động tính toán và thông báo đến bạn.Ngoài ra, bạn cũng có thể liên hệ NVKD đang phụ trách hoặc gửi yêu cầu đến Phòng Kỹ thuật để được hỗ trợ nâng cấp dịch vụ.'
    },
    {
        title: 'Dịch vụ của tôi đã (sắp) hết hạn, tôi phải làm gì?',
        content: `Khi dịch vụ của Quý khách sắp hết hạn, ENI Group sẽ gửi thông báo thanh toán trước thời điểm hết hạn 07 ngày. Quý khách cần thực hiện thanh toán trong thời gian này để dịch vụ không bị gián đoạn.
        - Sau 07 ngày, nếu chưa thanh toán, hệ thống sẽ nhắc thanh toán trễ hạn 3 lần. Nếu Quý khách vẫn chưa thanh toán (hoặc không có phản hồi), ENI Group sẽ ngừng hoạt động các dịch vụ sau 3 lần thông báo trễ hạn.
        - Dịch vụ của Quý khách sẽ bị xóa bỏ sau đó 07 ngày. Trong thời gian này, Quý khách vẫn có thể thanh toán để khôi phục hoạt động dịch vụ hoặc yêu cầu hỗ trợ mở lại để sao lưu dữ liệu (nếu không tiếp tục duy trì dịch vụ).
        Sau khi dịch vụ hết hạn, nếu có bất kỳ vấn đề phát sinh, Quý khách vui lòng liên hệ với nhân viên kinh doanh đang phụ trách hoặc hotline/livechat để được hỗ trợ.`
    }
]
</script>