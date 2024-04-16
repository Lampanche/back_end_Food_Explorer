const knex = require("../../database/knex")

const DiskStorage = require("../../providers/DiskStorage")

class AvatarControllers
{
  async create(req, res)
  { 
    const { meat_id } = req.params

    if(!req.file)
    {
      return res.status(200).json({message:"O avatar não foi cadastrado"})
    }
    
    const file = req.file.filename

    const diskStorage = new DiskStorage()

    const fileName = await diskStorage.saveFile(file)

    await knex
    .select("avatar")
    .from("meats")
    .where({id:meat_id})
    .update("avatar", fileName)

    return res.status(200).json({message:"O avatar foi cadastrado com sucesso"})

  }

  async update(req, res)
  {
    const { meat_id } = req.params

    if(!req.file)
    {
      return res.status(200).json({message:"O avatar não foi atualizado"})
    }

    const file = req.file.filename

    const meat = await knex("meats").where({id:meat_id}).first()

    const diskStorage = new DiskStorage()

    if(meat.avatar != null)
    { 
      await diskStorage.deleteFile(meat.avatar)
    }

    const fileName = await diskStorage.saveFile(file)

    await knex("meats")
    .update("avatar", fileName)
    .where({id:meat_id})

    return res.status(200).json({message:"O avatar foi atualizado com sucesso."})

  }

}


module.exports = AvatarControllers