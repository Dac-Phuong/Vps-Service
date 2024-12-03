import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    const match : any = { user: auth._id }

    const list = await DB.UserTax
    .find(match)
    .select('name tax_code address email user createdAt')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.UserTax.countDocuments(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})