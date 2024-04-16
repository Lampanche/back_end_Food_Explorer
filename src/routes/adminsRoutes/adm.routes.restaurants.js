const { Router } = require("express")

const verifyAuth = require("../../middlewares/verifyAuth")

const restaurantsRouter = Router()

const RestaurantsController = require("../../controllers/adminsControllers/RestaurantsController")

const restaurantsController = new RestaurantsController()

restaurantsRouter.post("/" , verifyAuth, restaurantsController.create)
restaurantsRouter.put("/:restaurant_id", verifyAuth, restaurantsController.update)
restaurantsRouter.delete("/:restaurant_id", verifyAuth, restaurantsController.delete)
restaurantsRouter.get("/index/:restaurant_id", verifyAuth, restaurantsController.index)
restaurantsRouter.get("/show", verifyAuth, restaurantsController.show)


module.exports = restaurantsRouter