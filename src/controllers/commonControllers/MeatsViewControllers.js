const knex = require("../../database/knex")
const AppError = require("../../utils/AppError")

class MeatsViewControllers
{
  async show(req, res)
  {

    const { restaurant_id } = req.params

    const { searchs } = req.query
 
    let searchMeats 

    if(searchs)
    {
      const listSearchs = searchs.split(",").map(search => search.trim())

      searchMeats = await knex.select("meats.*", "ingredients.name as nameIngredient").from("meats") 
      .innerJoin("ingredients", "ingredients.meat_id", "meats.id")
      .where("meats.restaurant_id", restaurant_id)
      .whereIn("ingredients.name", listSearchs)
      .orWhere((builder) => {

        listSearchs.forEach(search => {

          builder.orWhere(builder => builder.whereLike("meats.name", `%${search}%`))

        })
      })
      .orderBy("meats.name")
      .groupBy("meats.name")
    }
    else
    {
      searchMeats = await knex("meats")
      .where({restaurant_id:restaurant_id})
    }

    const meatsPromisses = searchMeats.map( async meat => {

      const ingredientsInMeat = await knex("ingredients").where("meat_id", meat.id)

      return{
        meat: meat,
        ingredients: ingredientsInMeat,
      }

    })

    const meats = await Promise.all(meatsPromisses)

    return res.status(200).json(meats)

  }

  async index(req, res)
  {

    const { meat_id } = req.params

    const meat = await knex("meats").where({id:meat_id}).first()

    const ingredients = await knex("ingredients").where({meat_id})

    const category = await knex("categorys").where({id:meat.category_id}).first()

    return res.status(200).json({
      meat: meat,
      ingredients: ingredients,
      category: category
    })


  }

}

module.exports = MeatsViewControllers