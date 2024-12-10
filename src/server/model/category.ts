import type { Mongoose } from 'mongoose'
import { IDBCategory } from './../../../types/model/category.d';

export const DBCategory = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBCategory>({
    name: { type: String },
    key: { type: String },
    image: { type: String },
    color: { type: String, default: 'primary' }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('Category', schema, 'Category')
  const autoCreate = async () => {
    const category = await model.countDocuments({ key: 'vps-gia-re' })
    const category1 = await model.countDocuments({ key: 'vps-cao-cap' })
    if (category == 0) {
      await model.create({ name: 'VPS GIÁ RẺ', key: 'vps-gia-re', })
    }
    if (category1 == 0) {
      await model.create({ name: 'VPS CAO CẤP', key: 'vps-cao-cap', })
    }
  }
  autoCreate()

  return model
}