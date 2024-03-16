const { Router } = require("express")

const meatsRouter = Router()

const multer = require("multer")

const verifyAuth = require("../../middlewares/verifyAuth.js")

const uploadConfig = require("../../config/upload")

const upload = multer(uploadConfig.MULTER)

const MeatsController = require("../../controllers/adminsControllers/MeatsController")

const meatsController = new MeatsController()

const IngredientsController = require("../../controllers/adminsControllers/IngredientsController")

const ingredientsController = new IngredientsController()

const AvatarController = require("../../controllers/adminsControllers/AvatarController")

const avatarControllers = new AvatarController()

meatsRouter.post("/:admin_id/:restaurant_id",meatsController.create)
meatsRouter.put("/:admin_id/:meat_id", meatsController.update)
meatsRouter.get("/:admin_id/:meat_id", meatsController.show)
meatsRouter.get("/:admin_id", meatsController.index)
meatsRouter.delete("/:admin_id/:meat_id", meatsController.delete)

meatsRouter.post("/ingredients/:admin_id/:meat_id", ingredientsController.create)
meatsRouter.delete("/ingredients/:admin_id/:ingredient_id", ingredientsController.delete)

meatsRouter.patch("/avatar/:admin_id/:meat_id", upload.single("avatar"), avatarControllers.update)

module.exports =  meatsRouter