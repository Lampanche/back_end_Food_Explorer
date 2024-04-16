const { Router } = require("express")

const meatsRouter = Router()

const multer = require("multer")

const verifyAuth = require("../../middlewares/verifyAuth.js")

const uploadConfig = require("../../config/upload")

const upload = multer(uploadConfig.MULTER)

const MeatsController = require("../../controllers/adminsControllers/MeatsController")

const meatsController = new MeatsController()

const AvatarController = require("../../controllers/adminsControllers/AvatarController")

const avatarControllers = new AvatarController()

meatsRouter.post("/:restaurant_id", verifyAuth, meatsController.create)
meatsRouter.put("/:meat_id", verifyAuth, meatsController.update)
meatsRouter.delete("/:meat_id", verifyAuth, meatsController.delete)

meatsRouter.post("/avatar/:meat_id", verifyAuth, upload.single("avatar"), avatarControllers.create)
meatsRouter.patch("/avatar/:meat_id", verifyAuth, upload.single("avatar"), avatarControllers.update)

module.exports =  meatsRouter