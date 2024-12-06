import type { Mongoose } from 'mongoose'
import type { IGlobalDB } from '~~/types'

import { DBConfig } from './config'
import { DBUser, DBUserCart, DBUserTax } from './user'
import { DBLogAdmin, DBLogUser, DBLogLogin } from './log'
import { DBGate } from './gate'
import { DBProduct } from './product'
import { DBCategory } from './category'
import { DBOrder, DBOrderDetail } from './order'
import { DBOS } from './os'
import { DBService, DBServiceUpgrate } from './service'
import { DBNews, DBNewsCategory } from './news'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    Gate: DBGate(mongoose),

    News: DBNews(mongoose),
    NewsCategory: DBNewsCategory(mongoose),

    User: DBUser(mongoose),
    UserTax: DBUserTax(mongoose),
    UserCart: DBUserCart(mongoose),
    
    Product: DBProduct(mongoose),
    OS: DBOS(mongoose),
    Category: DBCategory(mongoose),

    Order: DBOrder(mongoose),
    OrderDetail: DBOrderDetail(mongoose),

    Service: DBService(mongoose),
    ServiceUpgrade: DBServiceUpgrate(mongoose),

    LogUser: DBLogUser(mongoose),
    LogAdmin: DBLogAdmin(mongoose),
    LogLogin: DBLogLogin(mongoose)
  }
}