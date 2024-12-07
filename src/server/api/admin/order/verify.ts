import type { IAuth } from "~~/types"
import logAdmin from "../../../utils/logAdmin"
import verifyOrder from "../../../utils/verifyOrder"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    if(!!body.redo){
      const order = await DB.Order.findOne({ _id: body._id }).select('status code')
      if(!order) throw 'Giao dịch không tồn tại'
      if(order.status == 0) throw 'Giao dịch chưa được duyệt'

      const service = await DB.Service.find({ order: body._id, user: auth._id })
      if(!service) throw 'Không tìm thấy chi tiết giao dịch'

      service.forEach((item) => {
        item.status = 0
        item.save()
      });

      order.status = 0
      await order.save()
      await logAdmin(event, `Hoàn tác trạng thái giao dịch đơn hàng <b>${order.code}</b>`, auth._id)
      return resp(event, { message: 'Thao tác thành công' })
    }

    await verifyOrder(event, body, auth._id)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
