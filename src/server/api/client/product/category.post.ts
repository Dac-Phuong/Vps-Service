import type { IDBCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    // Props
    const match : any = { display: true }
      
    if(!!key){
      const categoryCheck = await DB.Category.findOne({ key: key }).select('_id') as IDBCategory
      if(!categoryCheck) throw 'Danh mục không tồn tại'
      match['category'] = categoryCheck._id
    }
    const list = await DB.Product
    .find(match)
    .select('-content')
    .populate({ path: 'category', select: 'name key' })
    .sort({ createdAt: -1 })
    .limit(8)
    const total = await DB.Product.countDocuments(match)

    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})