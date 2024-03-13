const knex = require("../../database/knex")
const AppError = require("../../utils/AppError")

class MeatsControllers
{
  async index(req, res)
  {

    const user_id = req.user.id

    const { restaurant_id } = req.params

    const { searchs } = req.query

    if(!user_id)
    { 
      throw new AppError("Usuário não encontrado.")
    }
 
    let searchMeats 

    if(searchs)
    {
      const listSearchs = searchs.split(",").map(search => search.trim())

      searchMeats = await knex("meats").select("*")
      .innerJoin("ingredients", "ingredients.meat_id", "meats.id")
      .where("meats.restaurant_id", restaurant_id)
      .whereIn("ingredients.name", listSearchs)
      .orWhere((builder)=>{
        builder.whereLike("meats.name", `%${listSearchs}%`)
      })
      .orderBy("meats.name")
      .groupBy("meats.name")
    }
    else
    {
      searchMeats = await knex("meats").select("*")
      .where({restaurant_id})
    }

    const allIngredientsInRestaurant = await knex("ingredients").where({restaurant_id})

    const allCategorysInRestaurant = await knex("categorys").where({restaurant_id})

    const meats = searchMeats.map(meat => {
      const ingredientsInMeat = allIngredientsInRestaurant.filter(ingredient => ingredient.meat_id == meat.id)
      const categorysInMeat = allCategorysInRestaurant.filter(category => category.meat_id == meat.id)

      return{
        meat: meat,
        ingredients: ingredientsInMeat,
        categorys: categorysInMeat
      }

    })

    return res.json(meats)

  }

  async show(req, res)
  {

    const user_id = req.user.id

    const { meat_id } = req.params

    if(!user_id)
    {
      throw new AppError("Usuário não encontrado.")
    }

    const meat = await knex("meats").where({id:meat_id}).first()

    const ingredients = await knex("ingredients").where({meat_id})

    const category = await knex("categorys").where({meat_id})


    return res.json({
      meat: meat,
      ingredients: ingredients,
      category: category
    })


  }

}

module.exports = MeatsControllers