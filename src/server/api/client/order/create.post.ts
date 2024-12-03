import { IAuth } from "~~/types";
import { IDBOS } from "~~/types/model/os";
import { IDBProduct } from "~~/types/model/product";

export default defineEventHandler(async (event) => {

    try {
        const user = (await getAuth(event)) as IAuth;
        if (!user) throw "Vui lòng đăng nhập trước trước";

        const body = await readBody(event);
        const { note, gate, code } = body;
        if (!gate || !code) throw "Dữ liệu đầu vào không hợp lệ";

        const gateSelect = (await DB.Gate.findOne({ _id: gate }).select("name number person type key qrcode callback display").populate({ path: 'product', select: '_id name', strictPopulate: false })) as IDBGate;
        if (!gateSelect) throw "Kênh nạp không tồn tại";
        if (!gateSelect.display) throw "Kênh nạp đang bảo trì";

        const cart = (await DB.UserCart.find({ user: user._id }).select("option server os product quantity"));
        if (!cart.length) throw "Không tìm thấy giỏ hàng";

        const total = await DB.UserCart.aggregate([
            { $match: { user: user._id } },
            { $group: { _id: null, total: { $sum: "$option.price" } } },
        ]).then((res) => res[0].total);

        const order = await DB.Order.create({
            user: user._id,
            code: code,
            gate: gate,
            note: note,
            money: parseInt(String(total)),
            status: 0,
        });
        if (!order) throw "Tạo giao dịch không thành công";
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            
            const product = await DB.Product.findOne({ _id: item.product }).select('_id name').populate({ path: 'product', select: '_id name', strictPopulate: false }) as IDBProduct
            if (!product) throw 'Sản phẩm không tồn tại'

            const os = await DB.OS.findOne({ _id: item.os }).select('name') as IDBOS
            if (!os) throw 'Hệ thống không tồn tại'

            await DB.OrderDetail.create({
                order: order._id,
                product: item.product,
                money: item.option.price,
                number: item.option.number,
                server: item.server,
                os: item.os,
                quantity: item.quantity,
            });

            await DB.Service.create({
                user: user._id,
                order: order._id,
                product: item.product,
                os: item.os,
                number: item.option.number,
                server: item.server,
                money: item.option.price,
                quantity: item.quantity,
                status: 0,
            });
        }
        await DB.UserCart.deleteMany({ user: user._id });
        return resp(event, { message: "Tạo giao dịch thành công", result: 2 });
    } catch (e: any) {
        return resp(event, { code: 400, message: e.toString() });
    }
});


