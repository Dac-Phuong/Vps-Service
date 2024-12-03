import { IDBUser } from "~~/types";

export default defineEventHandler(async (event) => {
    try {
      const user = (await getAuth(event)) as IDBUser;
      if (!user) throw "Vui lòng đăng nhập trước";
      const { _id } = await readBody(event);
      if (!_id) throw "Không tìm thấy ID giỏ hàng";

      const cart = await DB.UserCart.findByIdAndDelete({ _id: _id });
      return resp(event, { message: "Xóa giỏ hàng thành công" ,result: cart });
    } catch (error:any) {
      return resp(event, { code: 500, message: error.toString() });
    }
  });
  
  