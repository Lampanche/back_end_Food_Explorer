const { Router } = require("express")

const favoritesRouter = Router()

const verifyAuth = require("../../middlewares/verifyAuth")

const FavoritesController = require("../../controllers/usersControllers/FavoritesController")

const favoritesController = new FavoritesController()

favoritesRouter.post("/:meat_id", verifyAuth, favoritesController.create)
favoritesRouter.get("/:restaurant_id", verifyAuth, favoritesController.show)
favoritesRouter.get("/index/:meat_id", verifyAuth, favoritesController.index)
favoritesRouter.delete("/:favorite_id", verifyAuth, favoritesController.delete)


module.exports = favoritesRouter