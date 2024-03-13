const { Router } = require("express")

const meatsRouter  = Router()

const MeatsControllers = require("../../controllers/usersControllers/MeatsControllers")

const meatsControllers = new MeatsControllers()

const verifyAuth = require("../../middlewares/verifyAuth")

meatsRouter.get("/meats/:restaurant_id", verifyAuth, meatsControllers.index)
meatsRouter.get("/meats/:meat_id", verifyAuth , meatsControllers.show)


module.exports = meatsRouter