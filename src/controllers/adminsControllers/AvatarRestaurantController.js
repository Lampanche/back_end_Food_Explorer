const DiskStorage = require("../../providers/DiskStorage.js")

const knex = require("../../database/knex")

class AvatarRestaurantController
{
  async create(req, res)
  {
    const { restaurant_id } = req.params

    if(!req.file)
    {
      return res.status(200).json({message: "Sem cadastro de imagem."})
    }

    const file = req.file.filename

    const diskStorage = new DiskStorage()

    const fileName = await diskStorage.saveFile(file)

    await knex("restaurants").update({avatar:fileName}).where({id:restaurant_id})

    return res.status(200).json({message: "Avatar cadastrado com sucesso."})
  }

  async update(req,res)
  {
    const { restaurant_id } = req.params

    if(!req.file)
    {
      return res.status(200).json({message:"O avatar não foi atualizado."})
    }

    const file = req.file.filename

    const restaurant = await knex("restaurants").where({id:restaurant_id}).first()

    const diskStorage = new DiskStorage()

    if(restaurant.avatar !== null)
    {
      await diskStorage.deleteFile(restaurant.avatar)
    }

    const fileName = await diskStorage.saveFile(file)

    await knex("restaurants").where({id:restaurant_id}).first().update({avatar:fileName})

    return res.status(200).json({message:"Avatar atualizado com sucesso."})

  }

}

module.exports = AvatarRestaurantController