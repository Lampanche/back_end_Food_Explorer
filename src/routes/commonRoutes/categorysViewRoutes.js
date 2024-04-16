const { Router } = require("express")

const categorysViewRouter = Router()

const verifyAuth = require("../../middlewares/verifyAuth")

const CategorysViewControllers = require("../../controllers/commonControllers/CategorysViewControllers")

const categorysViewControllers = new CategorysViewControllers()

categorysViewRouter.get("/:restaurant_id", verifyAuth ,categorysViewControllers.show)

module.exports = categorysViewRouter