import { deleteCookie, getCookie, type H3Event } from 'h3'
import type { IDBUser, IResp, IAuth } from '~~/types'
import jwt from 'jsonwebtoken'

export default async (event: H3Event, throwError: boolean = true): Promise<IAuth | IResp | null> => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const token = getCookie(event, 'token-auth')
    if (!token) throw 'Vui lòng đăng nhập trước trước'

    const decoded = jwt.verify(token, runtimeConfig.apiSecret) as any
    const user = await DB.User.findOne({ _id: decoded._id }).select('account type token') as IDBUser

    if (!user) throw 'Xác thực tài khoản không thành công'
    if (user.token != token) throw 'Tài khoản đang đăng nhập ở nơi khác, Vui lòng đăng nhập trước lại'

    // check dịch vụ hết hạn
    const now = new Date();
    await DB.Service.updateMany( { user: user._id, status: 4, end_time: { $lt: now } },{ $set: { status: 2 } });

    const result = {
      _id: user._id,
      account: user.account,
      email: user.email,
      type: user.type
    }
    event.context.auth = result
    return result as any
  }
  catch (e: any) {
    if (!!throwError) {
      deleteCookie(event, 'token-auth', runtimeConfig.public.cookieConfig)
      event.node.res.end(JSON.stringify({ code: 401, message: e.toString() }))
    }
    return null
  }
}