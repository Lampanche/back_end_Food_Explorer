const knex = require("../../database/knex")

const AppError = require("../../utils/AppError")

class MeatsController
{
  async create(req, res)
  {
    const { name, description, price, ingredients, category } = req.body
    const {  admin_id , restaurant_id } = req.params

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    if(!name || !description || !price || !ingredients || !category)
    {
      throw new AppError("Todos os campos são obrigatórios para o cadastro do prato")
    }

    const meat = await knex("meats").insert({
      name,
      description,
      price,
      restaurant_id
    })

    const listIngredients = ingredients.map(ingredient => {
      return {
        name: ingredient,
        meat_id: meat[0],
        restaurant_id: restaurant_id
      }
    })

    await knex("ingredients").insert(listIngredients)

    await knex("categorys").insert({
      name: category,
      meat_id: meat[0],
      restaurant_id
    })


    return res.status(201).json()

  }

  async update(req, res)
  {
    const { name, description, price, category } = req.body
    const { admin_id, meat_id } = req.params

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    const meat = await knex("meats").where({id:meat_id}).first()

    meat.name = name ?? meat.name
    meat.description = description ?? meat.description
    meat.price = price ?? meat.price

    await knex("meats").update({
      name: meat.name,
      description: meat.description,
      price: meat.price,
      update_at: knex.fn.now()
    }).where({id:meat_id})

    await knex("categorys").update({
      name:category
    }).where({meat_id})

    return res.status(201).json()

  }

  async show(req, res)
  {

    const { admin_id, meat_id } = req.params

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    const meat = await knex("meats").where({id:meat_id}).first()

    const ingredients = await knex("ingredients").where({meat_id})

    const category = await knex("categorys").where({meat_id}).first()

    return res.json({
      meat,
      ingredients,
      category
    })

  }

  async index(req, res)
  {
    const { admin_id } = req.params
    const { searchs } = req.query

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    const restaurantAdmin = await knex("restaurants").where({admin_id}).first()
    
    let searchMeats

    if(searchs)
    {
      const listSearch = searchs.split(",").map(search => search.trim())

      searchMeats = await knex("meats")
      .select([
        "meats.name",
        "meats.description",
        "meats.price",
        "meats.id"
      ])
      .innerJoin("ingredients", "ingredients.meat_id", "meats.id")
      .where("meats.restaurant_id", restaurantAdmin.id)
      .whereIn("ingredients.name", listSearch)
      .orWhere((builder) => {
        builder.whereLike("meats.name", `%${listSearch}%`)
      })
      .orderBy("meats.name")
      .groupBy("meats.name")

    }
    else
    {
      searchMeats = await knex("meats").where({restaurant_id:restaurantAdmin.id})
    }
    
    const ingredients = await knex("ingredients").where({restaurant_id:restaurantAdmin.id})
    const categorys = await knex("categorys").where({restaurant_id:restaurantAdmin.id})

    const meats = searchMeats.map(meat => {
      const ingredientsInMeat = ingredients.filter(ingrediente => ingrediente.meat_id == meat.id)
      const categorysInMeat = categorys.filter(category => category.meat_id == meat.id)

      return {
        meat: meat,
        ingredients: ingredientsInMeat,
        category: categorysInMeat
      }

    })

    return res.json(meats)

  }

  async delete(req, res)
  {
    const { admin_id, meat_id } = req.params

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    await knex("meats").delete().where({id:meat_id})

    return res.json()

  }

}

module.exports = MeatsController