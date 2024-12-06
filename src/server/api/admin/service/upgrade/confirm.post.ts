import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải là quản trị viên'

    const { _id, money } = await readBody(event)
    if (!_id || isNaN(money)) throw 'Dữ liệu đầu vào không hợp lệ'

    const upgrade = await DB.ServiceUpgrade.findOne({ _id: _id })
    if (!upgrade) throw 'Gói nâng cấp không tìm thấy'

    const service = await DB.Service.findOne({ _id: upgrade.service })
    if (!service) throw 'Dịch vụ không tìm thấy'

    upgrade.status = 1
    upgrade.money = money
    await upgrade.save()
    return resp(event, { result: true, message: 'Duyệt thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
