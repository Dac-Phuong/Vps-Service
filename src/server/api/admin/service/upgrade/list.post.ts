import type { IAuth } from "~~/types"
export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!search.key){
      if(search.by == 'USER'){
        const users = await DB.User.find({ username : { $regex : search.key.toLowerCase(), $options : 'i' } }).select('_id')
        match['user'] = { $in: users.map(i => i._id) }
      }
      if(search.by == 'CODE'){
        match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      }
    }

    const list = await DB.ServiceUpgrade
      .find(match)
      .populate({ path: 'service', model: 'Sevice', select: 'product os server info' ,  })
      .populate({ path: 'user', select: 'username' })
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

