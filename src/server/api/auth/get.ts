import type { IAuth, IDBUser, IDBUserStore } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    // Get User
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }).select('account username type email phone cccd address') as IDBUser
    // Result
    await user.save()
    const userStore : IDBUserStore = {
      _id: user._id,
      account: user.account,
      username: user.username ? user.username : '',
      type: user.type,
      email: user.email,
      phone: user.phone,
      cccd: user.cccd,
      address: user.address
    }
    
    return resp(event, { result: userStore })
  } 
  catch (e:any) {
    return resp(event, { code: 401, message: e.toString() })
  }
})