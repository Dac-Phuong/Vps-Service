import { IAuth, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const { service, code, ram, cpu, disk, gate, server } = await readBody(event)
    if (!service) throw 'Dữ liệu đầu vào không hợp lệ'
    if (isNaN(ram) || isNaN(cpu) || isNaN(disk)) throw 'Dữ liệu đầu vào không hợp lệ'
    if(ram == 0 && cpu == 0 && disk == 0) throw 'Vui lòng chọn nâng cấp'
    if(!server) throw 'Vui lòng chọn ip máy chủ'

    const config = await DB.Config.findOne({}).select('product') as IDBConfig
    if (!config) throw 'Không tìm thấy cấu hình vps'

    const check = await DB.Service.findOne({ _id: service })
    if (!check) throw 'Không tìm dịch vụ'

    const checkUpgrade = await DB.ServiceUpgrade.findOne({ service: check._id, user: auth._id, status: 0 })
    if (checkUpgrade) throw 'Bạn có gói nâng cấp chưa hoàn tất, Vui lòng thanh toán để tiếp tục' 

    const total = ram * config.product.ram + cpu * config.product.cpu + disk * config.product.disk
    const upgrade = await DB.ServiceUpgrade.create({
      gate: gate._id,
      service: check._id,
      user: auth._id,
      code: code,
      option: {
        ram: ram,
        cpu: cpu,
        disk: disk
      },
      money: total || 0,
      server: server,
      status: 0
    })

    await upgrade.save()

    return resp(event, { message: 'Thao tác thành công' })

  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
