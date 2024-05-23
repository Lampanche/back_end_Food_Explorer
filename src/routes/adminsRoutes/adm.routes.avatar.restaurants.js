const { Router } = require("express")

const multer = require("multer")

const AvatarRestaurantController = require("../../controllers/adminsControllers/AvatarRestaurantController")

const uploadConfig = require("../../config/upload")

const verifyAuth = require("../../middlewares/verifyAuth")

const upload = multer(uploadConfig.MULTER)

const avatarRestaurantController = new AvatarRestaurantController()

const avatarRestaurantRouter = Router()

avatarRestaurantRouter.post("/create/:restaurant_id", verifyAuth, upload.single("avatar"), avatarRestaurantController.create)
avatarRestaurantRouter.patch("/up/:restaurant_id", verifyAuth, upload.single("avatar"), avatarRestaurantController.update)

module.exports = avatarRestaurantRouter