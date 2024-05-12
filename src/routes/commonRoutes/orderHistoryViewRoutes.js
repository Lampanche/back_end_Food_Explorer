const { Router } = require("express")

const orderHistoryViewRouter = Router()

const verifyAuth = require("../../middlewares/verifyAuth")

const OrderHistoryViewController = require("../../controllers/commonControllers/OrderHistoryViewController")

const orderHistoryViewController = new OrderHistoryViewController()

orderHistoryViewRouter.get("/:restaurant_id", verifyAuth, orderHistoryViewController.show)


module.exports = orderHistoryViewRouter