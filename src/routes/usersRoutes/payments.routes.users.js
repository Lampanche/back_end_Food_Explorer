const { Router } = require("express")

const paymentsRoutes = Router()

const verifyAuth = require("../../middlewares/verifyAuth")

const PaymentsController = require("../../controllers/usersControllers/PaymentsController")

const paymentsController = new PaymentsController()

paymentsRoutes.post("/:restaurant_id", verifyAuth ,paymentsController.create)

module.exports = paymentsRoutes