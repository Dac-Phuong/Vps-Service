import type { Model } from 'mongoose'
import type { IDBCategory } from './category'
import type { IDBProduct } from './product'
import type { IDBOrder, IDBOrderDetail } from './order'
import type { IDBUser, IDBUserCart, IDBUserTax } from './user'
import type { IDBOS } from './os'
import type { IDBService, IDBServiceUpgrade } from './service'
import type { IDBNews, IDBNewsCategory } from './news'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBUser, IDBUserStore } from './user'
export { IDBGate } from './gate'
export { IDBLogAdmin, IDBLogLogin, IDBLogUser } from './log'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  User: Model<IDBUser>
  UserTax: Model<IDBUserTax>
  UserCart: Model<IDBUserCart>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  Gate: Model<IDBGate>
  Category: Model<IDBCategory>
  Product: Model<IDBProduct>
  
  Order: Model<IDBOrder>
  OrderDetail: Model<IDBOrderDetail>
   
  Service: Model<IDBService>
  ServiceUpgrade: Model<IDBServiceUpgrade>
  OS: Model<IDBOS>
  
  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>
}