const { Router } = require("express")

const usersRouter = Router()

const UsersController = require("../../controllers/usersControllers/UsersController")

const usersController = new UsersController()

usersRouter.post("/", usersController.create)


module.exports = usersRouter