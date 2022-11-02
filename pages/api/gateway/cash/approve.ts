import type { NextApiRequest, NextApiResponse } from "next";
import {
  addCode,
  getOrder,
  updateOrder,
} from "../../../../lib/private/firestore";
import { CreateCashRequestSchema } from "../../../../types/request";

type Data = {
  success: boolean;
  message?: string;
  data?: any;
};

console.info("----- Y ESTOO");
const request = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  console.info("Entramos aca");
  if (req.method !== "POST") {
    throw new Error("Only POST method is allowed");
  }

  console.info("SEGUIMOS");
  try {
    const requestData = CreateCashRequestSchema.parse(req.body);
    const { orderId } = requestData;

    console.info("ORDEN?");
    const order = await getOrder(orderId);

    console.dir(order);

    if (!order) {
      throw new Error("Order ID doesnt exist");
    }

    const code = await addCode(orderId);

    console.info(code);
    await updateOrder(orderId, {
      status: "completed",
      pos: "request_payment",
    });

    // Reply OK
    res.status(200).json({
      success: true,
      data: {
        code,
      },
    });
  } catch (e: any) {
    console.error(e);
    res.status(406).json({ success: false, message: e.message });
  }
};

export default request;
