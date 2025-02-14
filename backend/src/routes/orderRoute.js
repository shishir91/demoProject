const {Router} = require("express");
const orderController = require("../controllers/orderController");
// const userMiddleware = require("../middlewares/")
const router = Router();


router.post("/",orderController.makeOrder);

module.exports = router;