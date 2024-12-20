import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải quản trị viên'
    const config = await DB.Config.findOne().select('product')
    return resp(event, { result: config })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
