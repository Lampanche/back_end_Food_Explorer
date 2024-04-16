const knex = require("../../database/knex")

class CategorysViewControllers
{
  async show(req, res)
  {
    const { restaurant_id } = req.params

    const categorysInRestaurant = await knex("categorys").where({restaurant_id})

    return res.status(200).json(categorysInRestaurant)

  }
}

module.exports = CategorysViewControllers