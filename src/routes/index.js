const { Router } = require("express")

const routes = Router()

const adm_adminsRoutes = require("./adminsRoutes/adm.routes.admins")

const adm_restaurantsRoutes = require("./adminsRoutes/adm.routes.restaurants")

const adm_meatsRoutes = require("./adminsRoutes/adm.routes.meats")

const user_usersRoutes = require("./usersRoutes/user.routes.users")

const user_meatsRoutes = require("./usersRoutes/user.routes.meats")

const common_sessionsRoutes = require("./commonRoutes/sessionRoutes")

routes.use("/admins", adm_adminsRoutes)
routes.use("/restaurants", adm_restaurantsRoutes)
routes.use("/meats", adm_meatsRoutes)

routes.use("/users", user_usersRoutes)
routes.use("/user_views", user_meatsRoutes)

routes.use("/session", common_sessionsRoutes)

module.exports = routes