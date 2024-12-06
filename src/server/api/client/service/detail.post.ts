import { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { _id } = await readBody(event)
    if (!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const service = await DB.Service.findOne({ _id: _id })
      .populate({ path: 'product', select: 'name' })
      .populate({ path: 'os', select: 'name' })
      .populate({ path: 'order', populate: { path: 'gate', select: 'name person number' } }).lean() 
    if (!service) throw 'Không tìm thấy dịch vụ'
    const gate = await DB.Gate.find({ display: true }).select('name person number')

    return resp(event, { result: { gate, service } })
  } catch (error) {
    console.error(error)
    return resp(event, { code: 400, message: error?.toString() })
  }
})


