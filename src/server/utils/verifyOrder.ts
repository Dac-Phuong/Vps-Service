import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import { IDBGate, IDBUser } from '~~/types'
import { IDBOrder } from '~~/types/model/order'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event,
  { _id, status, money, reason }: IBodyData,
  verifier?: Types.ObjectId,
  sendNotify: boolean = true
): Promise<void> => {
  if (!_id) throw 'Không tìm thấy ID giao dịch'
  if (
    !!isNaN(parseInt(String(status)))
    || parseInt(String(status)) < 1
    || parseInt(String(status)) > 2
  ) throw 'Mã trạng thái không hợp lệ'
  if (
    !!isNaN(parseInt(String(money)))
    || parseInt(String(money)) < 0
  ) throw 'Số tiền không hợp lệ'
  if (status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Set Real Value
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Payment
  const order = await DB.Order
    .findOne({ _id: _id })
    .select('code gate user status createdAt') as IDBOrder
  if (!order) throw 'Giao dịch không tồn tại'
  if (order.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const user = await DB.User.findOne({ _id: order.user }).select('_id') as IDBUser
  if (!user) throw 'Không tìm thấy thông tin tài khoản'

  const gate = await DB.Gate.findOne({ _id: order.gate, display: true }).select('_id') as IDBGate
  if (!gate) throw 'Không tìm thấy thông tin kênh nạp'

  const service = await DB.Service.find({ order: _id, user: user._id })
  if (!service) throw 'Không tìm thấy chi tiết giao dịch'

  // Set Verify Person
  let verify_person
  if (!!verifier) {
    verify_person = verifier
  }

  // Update Payment
  const time = new Date(order.createdAt)

  await DB.Order.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })

  // Check Status
  if (realStatus == 1) {
    await DB.Order.updateOne({ _id: _id }, {
      $inc: { order: 1 }
    })
    service.forEach(async (item) => {
      item.end_time = new Date(order.createdAt.getTime() + (item.number * 30 * 24 * 60 * 60 * 1000));
      item.status = 1
      await item.save();
    });
    if (!!verifier) logAdmin(event, `Chấp nhận giao dịch mua hàng <b>${order.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verifier)
  }
  else {
    if (realStatus == 2) {
      service.forEach(async (item) => {
        item.status = 3
        await item.save();
      });
    }
    if (!!verifier) logAdmin(event, `Từ chối giao dịch mua hàng <b>${order.code}</b> với lý do <b>${realReason}</b>`, verifier)
  }
}