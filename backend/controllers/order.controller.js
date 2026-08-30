import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  const order = req.body;
  try {
    const orderInfo = await Order.create(order);
    const userId = orderInfo?.userId;
    const courseId = orderInfo?.courseId;

    if (userId && courseId) {
      const existingPurchase = await Purchase.findOne({ userId, courseId });
      if (!existingPurchase) {
        await Purchase.create({ userId, courseId });
      }
    }

    res.status(201).json({ message: "Order processed successfully", orderInfo });
  } catch (error) {
    console.error("Error in order creation:", error);
    res.status(500).json({ errors: "Error in order creation" });
  }
};
