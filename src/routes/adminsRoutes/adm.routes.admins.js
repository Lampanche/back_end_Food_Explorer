const { Router } = require("express")

const adminsRouter = Router()

const AdminsController = require("../../controllers/adminsControllers/AdminsController")

const adminsController = new AdminsController()

adminsRouter.post("/", adminsController.create)


module.exports = adminsRouter