import { subDays } from "date-fns"
import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const { size, current, sort, search } = await readBody(event)
    if (!size || !current) throw 'Dữ liệu phân trang sai'
    if (!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting: any = { [sort.column]: sort.direction === 'desc' ? -1 : 1 }
    const match: any = { user: auth._id }

    if (search?.key && search.by === 'PRODUCT') {
      const products = await DB.Product.find({
        name: { $regex: search.key.toLowerCase(), $options: 'i' }}).select('_id')
        match.product = { $in: products.map(i => i._id) }
    }

    const now = new Date()
    const addDays = subDays(now, -5)

    await DB.Service.updateMany({ user: auth._id, status: 1, end_time: { $lte: addDays } }, { $set: { status: 4 } } )

    // Truy vấn danh sách
    const list = await DB.Service
      .find(match)
      .populate({ path: 'product', select: 'name' })
      .populate({ path: 'user', select: 'account' })
      .populate({ path: 'os', select: 'name' })
      .sort(sorting)
      .limit(size)
      .skip((current - 1) * size)

    const total = await DB.Service.countDocuments(match)

    return resp(event, { result: { list, total } })
  } catch (e: any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})
