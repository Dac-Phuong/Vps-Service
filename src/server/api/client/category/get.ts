export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Category.find({}).select("_id name key image");
    return resp(event, { result: list });
  } catch (error:any) {
    return resp(event, { code: 400, message: error.toString() });
  }
});
