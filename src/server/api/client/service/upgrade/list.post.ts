import type { IAuth } from "~~/types"
export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    const { size, current, sort, search,_id } = await readBody(event)
    if(!size || !current || !_id) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {user: auth._id, service : _id}
    if(!!search.key){
      if(search.by == 'CODE'){
        match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      }
    }
    const list = await DB.ServiceUpgrade
      .find(match)
      .populate({ path: 'gate', select: 'name person number' })
      .sort(sorting)
      .limit(size)
      .skip((current - 1) * size)

    const total = await DB.ServiceUpgrade.countDocuments(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e: any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})

