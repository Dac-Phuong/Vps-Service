export default defineEventHandler(async (event) => {
    try {
      const gates = await DB.Gate.find({ display: 1 }).select('-key -qrcode -createdAt -updatedAt')
      return resp(event, { result: gates })
    } 
    catch (e:any) {
      return resp(event, { result: [] })
    }
  })