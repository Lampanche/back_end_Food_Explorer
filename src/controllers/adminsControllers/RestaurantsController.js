const knex = require("../../database/knex")

const DiskStorage = require("../../providers/DiskStorage")

const AppError = require("../../utils/AppError.js")

class RestaurantsController
{
  async create(req, res)
  {
    
    const admin_id = req.user.id

    const { name, account, agency, categorys } = req.body

    if((name == null || name == "" || name == undefined) || (account == null || account == "" || account == undefined) || (account == null || account == "" || account == undefined) || (categorys == null || categorys == "" || categorys == undefined))
    {
      throw new AppError("Os campos de nome, conta, categorias e agencia são obrigatórios")
    }

    const newRestaurant = await knex("restaurants").insert({
      name,
      admin_id,
      account,
      agency,
    })

    categorys.forEach( async category => {

      await knex("categorys").insert({
        name:category,
        restaurant_id: newRestaurant[0]
      })

    })

    return res.status(201).json({message:"Restaurante criado com sucesso", restaurante: newRestaurant[0]})

  }

  async update(req, res)
  {
    const { name, account, agency, categorys, categorysExcluded } = req.body

    const { restaurant_id } = req.params

    const restaurant = await knex("restaurants").where({id:restaurant_id})

    const categorysInRestaurant = await knex("categorys").where({restaurant_id:restaurant_id})

    restaurant.name = name ?? restaurant.name

    restaurant.account = account ?? restaurant.account

    restaurant.agency = agency ?? restaurant.agency

    if(categorys.length > 0)
    {

      const nameCategorysInRestaurant = categorysInRestaurant.map(categorys => categorys.name)

      const nameCategorysExcluded = categorysExcluded.map(categoryExcluded => categoryExcluded.name)

      const categorysFilteredByName = categorys.filter(category => !nameCategorysInRestaurant.includes(category) || nameCategorysExcluded.includes(category) )

      if(categorysFilteredByName.length > 0)
      {
        categorysFilteredByName.forEach( async (category) => {
          
          console.log(category, "categoria para se cadastrada")
          await knex("categorys").insert({name:category, restaurant_id})
  
        })
      }

    }

    if(categorysExcluded.length > 0)
    {
      categorysExcluded.forEach(async category => {

        await knex("categorys").where({id:category.id}).delete()

      })
    }

    await knex("restaurants").where({id:restaurant_id}).first().update({
      name: restaurant.name,
      account: restaurant.account,
      agency: restaurant.agency
    })

    return res.status(200).json({message:"Restaurante atualizado com sucesso"})

  }

  async delete(req, res)
  {
    const { restaurant_id } = req.params

    const restaurant =  await knex("restaurants").where({id:restaurant_id}).first()

    const diskStorage = new DiskStorage()

    if(restaurant.avatar !== null)
    {
      await diskStorage.deleteFile(restaurant.avatar)
    }

    await knex("restaurants").where({id:restaurant_id}).first().delete()

    return res.status(200).json({message: "Restaurante excluido com sucesso"})

  }

  async show(req, res)
  {
    const admin_id  = req.user.id

    const { searchs } = req.query

    let restaurant

    if(searchs)
    {
      
      const listSearchs = searchs.split(",").map( search => search.trim())
  
      restaurant = await knex.select(["restaurants.*" ,"categorys.name as nameCategory"]).from("restaurants")
      .innerJoin("categorys", "categorys.restaurant_id" ,"restaurants.id")
      .where("restaurants.admin_id", admin_id)
      .whereIn("categorys.name", listSearchs)     
      .orWhere(build => {

        listSearchs.forEach( search => {

          build.orWhere(build => 
            {
             
              build.whereLike("restaurants.name", `%${search}%`)

            })

        } ) 

      })
      .orderBy("restaurants.name")
      .groupBy("restaurants.name")
      

    }
    else
    {
      restaurant = await knex("restaurants").where({admin_id})
    }

    const categorys = await knex("categorys")

    const restaurants = restaurant.map( restaurant => {

      const categorysInRestaurant = categorys.filter( category => category.restaurant_id == restaurant.id )

      return {

        restaurant: restaurant,
        categorys: categorysInRestaurant

      }

    })


    return res.status(200).json(restaurants)

  }

  async index (req, res)
  {
    const { restaurant_id } = req.params

    const restaurant = await knex("restaurants").where({id:restaurant_id}).first()

    const categorys = await knex("categorys").where({restaurant_id})

    return res.status(200).json({restaurant, categorys})

  }

}

module.exports = RestaurantsController