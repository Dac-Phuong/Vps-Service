import { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = (await getAuth(event)) as IDBUser
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'
    const { _id, info } = await readBody(event)
    if (!_id || !info) throw 'Dữ liệu đầu vào không hợp lệ'
    if (!Array.isArray(info) || info.length < 1) throw 'Thông tin vps không hợp lệ'

    for (const item of info) {
      if (!item.ip || !item.password) throw 'Dữ liệu đầu vào không hợp lệ'
      if (!/^[a-zA-Z0-9!@#$%^&*_\-]{6,16}$/.test(item.password)) throw 'Mật khẩu vps không hợp lệ'
    }
    const service = await DB.Service.findOne({ _id: _id })
    if(!service) throw 'Không tìm thấy dịch vụ'
    if(service.status !== 1 ) throw 'VPS này chưa kích hoạt'

    service.info = info
    await service.save()
    return resp(event, { message: 'Thao tác thành công' })
  } catch (error: any) {
    return resp(event, { code: 400, message: error.toString() })
  }
})
