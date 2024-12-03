import { IDBUser } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IDBUser;
    if (!user) throw "Vui lòng đăng nhập trước";

    const { _id, quantity } = await readBody(event);
    if (!_id || !quantity) throw "Dữ liệu không hợp lệ.";
    if(quantity && !Number.isInteger(quantity)) throw 'Số lượng phải lớn hơn 0'

    const cart = await DB.UserCart.findOne({ _id: _id, user: user._id });
    if (!cart) throw "Không tìm thấy giỏ hàng";

    cart.quantity = quantity;
    await DB.UserCart.updateOne({ _id: _id }, cart);
    return resp(event, { message: "Cập nhật số lượng thành công", result: cart });
  } catch (error:any) {
    return resp(event, { code: 500, message: error.toString() });
  }
})
