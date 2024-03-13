const { Router } = require("express")

const restaurantsRouter = Router()

const RestaurantsController = require("../../controllers/adminsControllers/RestaurantsController")

const restaurantsController = new RestaurantsController()

restaurantsRouter.post("/:admin_id", restaurantsController.create)

module.exports = restaurantsRouter