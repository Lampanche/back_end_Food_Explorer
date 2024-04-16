const knex = require("../../database/knex")


class FavoritesController
{
  async create(req, res)
  {
    const { meat_id } = req.params

    const user_id = req.user.id

    await knex("favorites").where({user_id}).insert({user_id, meat_id})

    return res.status(201)

  }

  async show(req, res)
  {

    const { restaurant_id } = req.params

    const user_id = req.user.id

    const userFavorites = await knex("favorites").where({user_id})

    const meats = await knex("meats").where({restaurant_id})

    const userFavoritesMeats = userFavorites.map( favorite => {

      const meatsFavorited = meats.filter( meat  => favorite.meat_id == meat.id)

      return meatsFavorited[0]
      

    })

    return res.status(200).json({favorites:userFavoritesMeats})

  }

  async delete(req, res)
  {
    const { favorite_id } = req.params

    const user_id = req.user.id

    await knex("favorites").where({user_id}).andWhere({id:favorite_id}).delete()

    return res.status(200).json({message:"Favorito deletado com sucesso"})

  }

}

module.exports = FavoritesController