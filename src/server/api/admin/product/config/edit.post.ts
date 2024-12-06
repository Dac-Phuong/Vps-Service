import { defineEventHandler } from "h3"
import type { IAuth } from "~~/types"
import logAdmin from "../../../../utils/logAdmin"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { ram, cpu, disk } = body
    
    await DB.Config.updateOne({}, { $set: { product: { ram, cpu, disk } } })
    logAdmin(event, "Sửa cài đặt VPS")

    return resp(event, { message: 'Cập nhật thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})


