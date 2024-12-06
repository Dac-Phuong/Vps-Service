import { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IDBUser
    if(user.type !== 100) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const upgrade = await DB.ServiceUpgrade.findOne({ _id: _id })
    if(!upgrade) throw 'Gói nâng cấp không tìm thấy'

    upgrade.status = 0
    await upgrade.save()
    return resp(event, { result: true, message:'Thao tác thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
