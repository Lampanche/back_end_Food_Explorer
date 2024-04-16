const knex = require("../../database/knex")

const AppError = require("../../utils/AppError")

class MeatsController
{
  async create(req, res)
  {
    const { name, description, price, ingredients, category } = req.body
    const { restaurant_id } = req.params

    if(!name || !description || !price || !ingredients || !category)
    {
      throw new AppError("Todos os campos são obrigatórios para o cadastro do prato")
    }

    const meat = await knex("meats").insert({
      name,
      description,
      price,
      restaurant_id,
      category_id: category
    })

    const listIngredients = ingredients.map(ingredient => {
      return {
        name: ingredient,
        meat_id: meat[0]
      }
    })

    const categoryOfMeat = await knex("categorys").where({id:category}).first()

    await knex("ingredients").insert(listIngredients)


    return res.status(201).json({message:`A sua ${categoryOfMeat.name} foi cadastrada com sucesso`, meat: meat[0]})

  }

  async update(req, res)
  {
    const { name, description, price, category, ingredients, ingredientsExcluded } = req.body
    const { meat_id } = req.params

    const meat = await knex("meats").where({id:meat_id}).first()

    meat.name = name ?? meat.name
    meat.description = description ?? meat.description
    meat.price = price ?? meat.price
    meat.category_id = category ?? meat.category_id

    await knex("meats").update({
      name: meat.name,
      description: meat.description,
      price: meat.price,
      category_id: meat.category_id,
      update_at: knex.fn.now()
    }).where({id:meat_id})

    if(ingredients.length > 0)
    {
      const ingredientsInMeat = await knex("ingredients").where({meat_id})

      const nameIngredientsInMeat = ingredientsInMeat.map( ingredientInMeat => ingredientInMeat.name)

      const nameIngredientsExcluded = ingredientsExcluded.map( ingredientExcluded => ingredientExcluded.name )
      
      const ingredientsFilteredByName = ingredients.filter( ingredient => {

       return !nameIngredientsInMeat.includes(ingredient) || nameIngredientsExcluded.includes(ingredient)

      })
      
      ingredientsFilteredByName.forEach( async ingredientFilteredByName => {

        await knex("ingredients").insert({name:ingredientFilteredByName, meat_id})

      })

      if(ingredientsExcluded.length > 0)
      {
        ingredientsExcluded.forEach( async ingredientExcluded => {

          await knex("ingredients").delete().where({id:ingredientExcluded.id})

        })
      }
      
    }

    const meatAtt = await knex("meats").where({id:meat_id}).first()
    
    const categoryInMeat = await knex("categorys").where({id:meatAtt.category_id}).first()

    return res.status(200).json({message:`A sua ${categoryInMeat.name} foi atualizada com sucesso`})

  }

  async delete(req, res)
  {
    const { meat_id } = req.params

    const meat = await knex("meats").where({id:meat_id}).first()

    await knex("meats").delete().where({id:meat_id})

    const meatInCategory = await knex("categorys").where({id:meat.category_id}).first()

    return res.status(200).json({message:`A sua ${meatInCategory.name} foi deletada com sucesso.`})

  }

}

module.exports = MeatsController