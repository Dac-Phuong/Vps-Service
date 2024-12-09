import type { IDBCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, category,search } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    // Props
    const match : any = { display: true }
    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    if(!!search.key){
      if(search.by == 'NAME') match['name'] = { $regex : `.*${search.key.toLowerCase()}.*`, $options : 'i' }
    }
  
    if(!!category && category._id != ''){
      const categoryCheck = await DB.Category.findOne({ _id: category._id }).select('_id') as IDBCategory
      if(!categoryCheck) throw 'Danh mục không tồn tại'
      match['category'] = categoryCheck._id
    }
    
    const listCategory = await DB.Category.find({}).select('_id name key')
    const list = await DB.Product
    .find(match)
    .select('-content')
    .populate({ path: 'category', select: 'name key color' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)
    const total = await DB.Product.countDocuments(match)

    return resp(event, { result: { list, total ,listCategory} })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})