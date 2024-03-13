const knex = require("../../database/knex")


class RestaurantsController
{
  async create(req, res)
  {
    const { name } = req.body

    const { admin_id } = req.params

    await knex("restaurants").insert({
      name,
      admin_id
    })

    return res.status(201).json()

  }
}

module.exports = RestaurantsController