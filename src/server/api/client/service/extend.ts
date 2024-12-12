import { IAuth, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const { service, option, code, gate, server } = await readBody(event)
    if (!option || !service || !code) throw 'Dữ liệu đầu vào không hợp lệ'
    if (!server) throw 'Vui lòng chọn ip máy chủ'
    
    const checkGate = await DB.Gate.findOne({ _id: gate._id })
    if (!checkGate) throw 'Không tìm thấy kênh thanh toán'

    const checkService = await DB.Service.findOne({ _id: service })
    if (!checkService) throw 'Không tìm dịch vụ'

    const checkUpgrade = await DB.ServiceUpgrade.findOne({ service: checkService._id, user: auth._id, status: 0, type: 1 })
    if (checkUpgrade) throw 'Vui lòng thanh toán gói gia hạn trước đó'

    const extend = await DB.ServiceUpgrade.create({
      gate: checkGate._id,
      service: checkService._id,
      user: auth._id,
      code: code,
      option: option,
      money: option.price || 0,
      server: server,
      type: 1,
      status: 0
    })

    await extend.save()
    return resp(event, { message: 'Gia hạn thành công vui lòng chờ duyệt' })

  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
