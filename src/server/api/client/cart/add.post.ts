import { IDBUser } from "~~/types"
import { IDBProduct } from "~~/types/model/product"
import { IDBUserCart } from "~~/types/model/user"

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event) as IDBUser
    if(!user) throw 'Vui lòng đăng nhập trước'
    const {key, option, server, os } = await readBody(event)
    if(!key || !option || !server || !os) throw 'Dữ liệu đầu vào không hợp lệ'

    const product = await DB.Product.findOne({ key: key }).select('_id name') as IDBProduct
    if(!product) throw 'Sản phẩm không tồn tại'

    const hasCart = await DB.UserCart.findOne({ product: product._id, user: user._id , option: option }).select('_id quantity option product') as IDBUserCart
    if(!!hasCart) {
      hasCart.quantity += 1
      await DB.UserCart.updateOne({ _id: hasCart._id }, hasCart)
      return resp(event, { message: 'Thêm giỏ hàng thành công', result: hasCart })
    }

    const cart = await DB.UserCart.create({
      user: user._id,
      product: product._id,
      option: option,
      os: os,
      server: server,
      quantity: 1
    })
    cart.save()

    return resp(event, { message: 'Thêm giỏ hàng thành công', result: cart })
  } catch (error: any) {
    return resp(event, { code: 400, message: error.toString() })
  }
})
