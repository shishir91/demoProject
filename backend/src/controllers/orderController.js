const Order = require("../models/orderModel"); // Adjust the path as needed

class OrderController {
  async makeOrder(req, res) {
    try {
      const { userId, storeId, products } = req.body;

      if (!userId || !storeId || !products || products.length === 0) {
        return res
          .status(400)
          .json({
            message: "Missing required fields or no products in the order.",
          });
      }

      // Calculate subtotal
      let subTotal = 0;
      products.forEach((product) => {
        subTotal += product.quantity * product.price;
      });

      // Assuming totalAmount includes some additional charges like tax or shipping
      const totalAmount = subTotal; // You can modify this to include other fees

      const newOrder = new Order({
        userId,
        storeId,
        products,
        subTotal,
        totalAmount,
        status: "pending",
      });

      const savedOrder = await newOrder.save();

      return res.status(201).json({
        message: "Order created successfully",
        order: savedOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new OrderController();
