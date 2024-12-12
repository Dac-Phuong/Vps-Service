import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải là quản trị viên'

    const { _id, money } = await readBody(event)
    if (!_id || isNaN(money)) throw 'Dữ liệu đầu vào không hợp lệ'

    const upgrade: any = await DB.ServiceUpgrade.findOne({ _id: _id })
    if (!upgrade) throw 'Gói nâng cấp không tìm thấy'

    const service = await DB.Service.findOne({ _id: upgrade.service })
    if (!service) throw 'Dịch vụ không tìm thấy'
    
    if(upgrade.type == 1 ){
      service.status = 1
      service.number = upgrade.option.number
      service.money = upgrade.option.price
      service.end_time = new Date(upgrade.createdAt.getTime() + (upgrade.option.number * 30 * 24 * 60 * 60 * 1000));
      await service.save()
    }

    upgrade.status = 1
    upgrade.money = money
    await upgrade.save()
    return resp(event, { result: true, message: 'Duyệt thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
