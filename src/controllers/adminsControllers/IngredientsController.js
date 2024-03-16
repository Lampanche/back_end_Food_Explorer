const knex = require("../../database/knex")
const AppError = require("../../utils/AppError")

class IngredientsController
{
  async create(req, res)
  {
  
    const { admin_id , meat_id } = req.params

    const { name } = req.body
    
    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    const adminRestaurant = await knex("restaurants").where({admin_id}).first()

    await knex("ingredients").insert({
      name,
      meat_id,
      restaurant_id:adminRestaurant.id
    })
   
    return res.status(201).json()

  }

  async delete(req, res)
  {

    const {  admin_id ,ingredient_id } = req.params

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    await knex("ingredients").delete().where({id:ingredient_id})

    return res.json()

  }

}

module.exports = IngredientsController