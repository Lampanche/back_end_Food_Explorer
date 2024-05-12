const { Router } = require("express")

const notificationPaymentsRoutes = Router()

const NotificationsPaymentsController = require("../../controllers/notificationsControllers/NotificationsPaymentsController")

const notificationsPaymentsController = new NotificationsPaymentsController()

notificationPaymentsRoutes.post("/", notificationsPaymentsController.create, notificationsPaymentsController.update)

module.exports = notificationPaymentsRoutes