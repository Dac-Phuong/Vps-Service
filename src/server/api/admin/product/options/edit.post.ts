import { defineEventHandler } from "h3"
import type { IAuth } from "~~/types"
import logAdmin from "../../../../utils/logAdmin"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { options, _id } = body
    
    if (!Array.isArray(options)) throw 'Dữ liệu không hợp lệ'
    
    const product = await DB.Product.findOne({ _id: _id }).select('options')
    if (!product) throw 'Sản phẩm không tồn tại'

    await DB.Product.updateOne({ _id: _id }, { $set: { options: options } })
    logAdmin(event, "Sửa giá sản phẩm")

    return resp(event, { message: 'Cập nhật giá thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})


