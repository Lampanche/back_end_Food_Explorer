const { Router } = require("express")

const routes = Router()

const adm_adminsRoutes = require("./adminsRoutes/adm.routes.admins")

const adm_restaurantsRoutes = require("./adminsRoutes/adm.routes.restaurants")

const adm_avatarRestaurantRoutes = require("./adminsRoutes/adm.routes.avatar.restaurants")

const adm_meatsRoutes = require("./adminsRoutes/adm.routes.meats")

const user_usersRoutes = require("./usersRoutes/user.routes.users")

const user_FavoriteRoutes = require("./usersRoutes/favorites.routes.users")

const common_meatsViewRoutes = require("./commonRoutes/meatsViewRoutes")

const common_sessionsRoutes = require("./commonRoutes/sessionRoutes")

const common_categorysViewRoutes = require("./commonRoutes/categorysViewRoutes")

routes.use("/admins", adm_adminsRoutes)
routes.use("/restaurants", adm_restaurantsRoutes)
routes.use("/avatar", adm_avatarRestaurantRoutes)
routes.use("/meats", adm_meatsRoutes)

routes.use("/users", user_usersRoutes)
routes.use("/favorites", user_FavoriteRoutes)

routes.use("/meatsViews", common_meatsViewRoutes)
routes.use("/session", common_sessionsRoutes)
routes.use("/categorys", common_categorysViewRoutes)

module.exports = routes