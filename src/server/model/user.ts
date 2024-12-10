import type { Mongoose } from 'mongoose'
import type { IDBUser } from '~~/types'
import md5 from 'md5'
import { IDBUserCart, IDBUserTax } from './../../../types/model/user.d';

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    account: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String, default: '/images/user/default.png' },
    cccd: { type: String },
    address: { type: String },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 100 - Admin,
    block: { type: Boolean, default: false }, // False, True
    token: { type: String },
    last_login: { type: Date },
  }, {
    timestamps: true
  })

  schema.index({ username: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('User', schema, 'User')

  const autoCreate = async () => {
    const admin = await model.countDocuments({account: 'admin'})
    const test123 = await model.countDocuments({account: 'test123'})
    if(admin == 0){
      await model.create({ account: 'admin', password: md5('Galvin81196@'), type: 100 })
    }
    if(test123 == 0){
      await model.create({ account: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 0 })
    }
  }
  autoCreate()
  
  return model
}

export const DBUserTax = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserTax>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tax_code: { type: String},
    name: { type: String},
    address: { type: String},
    email: { type: String},
  }, {
    timestamps: true
  })
  const model = mongoose.model('UserTax', schema, 'UserTax')
  return model
} 

export const DBUserCart = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserCart>({ 
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    option: { type: Object },
    server: { type: String },
    os: { type: mongoose.Schema.Types.ObjectId, ref: 'OS' },
    quantity: { type: Number },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Cart', schema, 'Cart')
  return model 
}