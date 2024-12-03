import { IDBUser } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IDBUser;
    const cart = await DB.UserCart.find({ user: user._id })
      .populate({
        path: "product",
        select: "name category options",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate("option")
      .sort({ createdAt: -1 });
    return resp(event, { result: cart });
  } catch (error:any) {
    return resp(event, { code: 500, message: error.toString() });
  }
});

