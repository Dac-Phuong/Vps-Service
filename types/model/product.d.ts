import type { Types } from 'mongoose'

export interface IDBProduct {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  name: string
  number: string
  category: Types.ObjectId
  specs: Array
  price: string
  key: string
  options: Array
  pin: number
  display: boolean
}