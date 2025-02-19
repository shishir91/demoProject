const Order = require("../models/orderModel");
const storeModel = require("../models/storeModel");

class OrderController {
  async makeOrder(req, res) {
    try {
      const {
        userName,
        userPhone,
        userAddress,
        storeId,
        products,
        Orderdate,
        time,
        extraNotes,
        tableNo,
      } = req.body;

      if (
        !userName ||
        !userPhone ||
        !storeId ||
        !products ||
        products.length === 0
      ) {
        return res.status(400).json({
          message: "Missing required fields or no products in the order.",
        });
      }

      let totalAmount = 0;
      products.forEach((product) => {
        totalAmount += product.productTotalPrice;
      });

      const newOrder = new Order({
        userName,
        userPhone,
        userAddress,
        storeId,
        products,
        Orderdate,
        time,
        extraNotes,
        tableNo,
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

  async getOrder(req, res) {
    const { storeId } = req.params;
    try {
      const checkStore = await storeModel.findOne({ _id: storeId });
      if (checkStore) {
        try {
          const orders = await Order.find({ storeId });

          // No image handling, directly return the orders
          return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            orders,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Error fetching orders" });
        }
      } else {
        return res.status(404).json({ message: "Store not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching store" });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { storeId } = req.params;
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required headers" });
      }

      // Validate status
      const validStatuses = ["pending", "paid", "failed"];
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status value" });
      }

      const order = await Order.findByIdAndUpdate(orderId, {
        status: status,
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      order.status = status;
      await order.save();

      res
        .status(200)
        .json({ success: true, message: `Order marked as ${status}`, order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteOrderStatus(req, res) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required headers" });
      }
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order Id not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Order deleted succesfully" });
    } catch (error) {
      console.error("Error deleting order", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      const { userName, userAddress, userPhone } = req.body;
      if (!orderId) {
        return res.status(404).json({
          success: false,
          message: "Order Id not found",
        });
      }

      if (!userName || !userAddress || !userPhone) {
        return res.status(400).json({
          success: false,
          message: "Update Fields are missing",
        });
      }

      const order = await Order.findByIdAndUpdate(orderId, {
        userName,
        userAddress,
        userPhone,
      });
      if (!order) {
        return res.status(404).json({
          success: true,
          message: "Order Id isn't valid",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Order updated succesfully",
      });
    } catch (error) {
      return res.status(400).json({
        success:false,
        message:`Order Update failed ${error.message}`
      })
    }
  }
}
module.exports = new OrderController();
