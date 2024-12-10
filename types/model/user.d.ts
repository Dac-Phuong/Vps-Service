import type { Types } from 'mongoose'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  account: string
  username: string
  password: string
  email: string
  phone: string
  avatar: string
  cccd: string
  address: string

  type: number
  block: boolean
  token: string
  last_login: date
  // Function
  save: {
    () : void
  }
}

export interface IDBUserTax {
  _id: Types.ObjectId
  user: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  name: string
  tax_code: string
  email: string
  address: string
}

export interface IDBUserCart {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  product: Types.ObjectId
  user: Types.ObjectId
  os: Types.ObjectId
  option: Object
  server: string
  quantity: number
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : string
  account? : string
  email?: string
  phone?: string
  avatar?: string
  type?: number
  block?: boolean
  cccd?: string
  address: string
}