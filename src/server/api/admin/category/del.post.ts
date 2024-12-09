import type { IAuth } from "~~/types"
import logAdmin from "../../../utils/logAdmin"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'


    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.Category.findOne({ _id: _id }).select('name key _id')
    if(!category) throw 'Danh mục không tồn tại'
    if(category.key == 'vps-gia-re' || category.key == 'vps-cao-cap') throw 'Không thể xóa danh mục này'  
    
    const product = await DB.Product.countDocuments({ category: _id })
    if(product > 0) throw 'Không thể xóa danh mục đã có sản phẩm'

    await DB.Category.deleteOne({ _id: _id })
    logAdmin(event, `Xóa danh mục sản phẩm <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa danh mục thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})