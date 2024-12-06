import type { Mongoose } from 'mongoose'
import { IDBProduct } from './../../../types/model/product.d';

export const DBProduct = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBProduct>({
    name: { type: String },
    specs: { type: Array },
    price: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    key: { type: String },
    options: { type: Array },
    pin: { type: Number, default: 0 },
    display: { type: Boolean, default: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', description: 'text', content: 'text' })

  const model = mongoose.model('Product', schema, 'Product')
  return model
}
