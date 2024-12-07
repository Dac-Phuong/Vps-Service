import { IDBUser } from "~~/types";
import resp from "../../../utils/resp"

export default defineEventHandler(async (event) => {
  try {
    const auth = (await getAuth(event)) as IDBUser
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'
    
    const orderMoney = (await DB.Order.find({ status: 1 })).reduce((sum, order) => sum + order.money, 0);
    const upgrade = (await DB.ServiceUpgrade.find({ status: 1})).reduce((sum, upgrade) => sum + upgrade.money, 0);
    const order = await DB.Order.find().countDocuments()
    const user = await DB.User.find().countDocuments()
    const service = await DB.Service.find({status: 1}).countDocuments()
    const total = orderMoney + upgrade
    
    const data = {
      total,
      order,
      user,
      service
    }
    return resp(event, { result: data })
  } catch (error: any) {
  return resp(event, { code: 400, message: error.toString() })
  }
})
