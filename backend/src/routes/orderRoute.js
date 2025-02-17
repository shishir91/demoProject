const {Router} = require("express");
const orderController = require("../controllers/orderController");
// const userMiddleware = require("../middlewares/")
const router = Router();


router.post("/",orderController.makeOrder);
router.get("/:storeId",orderController.getOrder);
router.put("/status/:storeId",orderController.updateOrderStatus);
router.delete("/status/:orderId",orderController.deleteOrderStatus);
router.put("/update/:orderId",orderController.updateOrderDetails);
module.exports = router;