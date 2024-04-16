const { Router } = require("express")

const meatsViewRouter = Router()

const MeatsViewControllers = require("../../controllers/commonControllers/MeatsViewControllers")

const meatsViewControllers = new MeatsViewControllers()

const verifyAuth = require("../../middlewares/verifyAuth")

meatsViewRouter.get("/index/:meat_id", verifyAuth, meatsViewControllers.index)
meatsViewRouter.get("/show/:restaurant_id", verifyAuth , meatsViewControllers.show)


module.exports = meatsViewRouter