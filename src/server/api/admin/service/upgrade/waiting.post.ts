import { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IDBUser
    if(user.type !== 100) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const upgrade:any = await DB.ServiceUpgrade.findOne({ _id: _id })
    if(!upgrade) throw 'Gói nâng cấp không tìm thấy'

    const service = await DB.Service.findOne({ _id: upgrade.service })
    if (!service) throw 'Dịch vụ không tìm thấy'

    if(upgrade.type == 1 ){
      service.status = 4
      service.number = upgrade.option.number
      service.money = upgrade.option.price
      service.end_time = null;
      await service.save()
    }
    upgrade.status = 0
    await upgrade.save()
    return resp(event, { result: true, message:'Thao tác thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
