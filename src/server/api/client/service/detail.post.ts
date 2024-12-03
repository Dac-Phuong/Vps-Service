export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id } = await readBody(event)
    if (!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const service = await DB.Service.findOne({ _id: _id })
      .populate({ path: 'product', select: 'name' })
      .populate({ path: 'os', select: 'name' })
      .populate({ path: 'order', populate: { path: 'gate', select: 'name person number' } })
    if (!service) throw 'Không tìm thấy dịch vụ'
    
    return resp(event, { result: service })
  } catch (error) {
    console.error(error)
    return resp(event, { code: 400, message: error?.toString()})
  }
})

