import { IDBUser } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IDBUser;
    if (!user) throw "Vui lòng đăng nhập trước";
    const { _id, option } = await readBody(event);
    if (!_id || !option) throw "Dữ liệu không hợp lệ.";

    const cart = await DB.UserCart.findOne({ _id: _id, user: user._id });
    if (!cart) throw "Không tìm thấy giỏ hàng";

    cart.option = option;
    await DB.UserCart.updateOne({ _id: _id }, cart);
    return resp(event, { message: "Cập nhật cấu hình thành công", result: cart });
  } catch (error:any) {
    return resp(event, { code: 500, message: error.toString() });
  }
});
