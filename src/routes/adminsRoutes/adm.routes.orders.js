const { Router } = require("express")

const verifyAuth = require("../../middlewares/verifyAuth")

const ordersRouter = Router()

const OrdersController = require("../../controllers/adminsControllers/OrdersController")

const ordersController = new OrdersController()

ordersRouter.put("/:order_id", verifyAuth, ordersController.update)


module.exports = ordersRouter