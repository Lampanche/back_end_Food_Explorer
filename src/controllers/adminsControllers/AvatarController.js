const knex = require("../../database/knex")

const DiskStorage = require("../../providers/DiskStorage")
const AppError = require("../../utils/AppError")

class AvatarControllers
{
  async update(req, res)
  {
    const { admin_id, meat_id } = req.params
    const  file  = req.file.filename

    if(!admin_id)
    {
      throw new AppError("Administrador não encontrado.")
    }

    const diskStorage = new DiskStorage()

    const meat = await knex("meats").where({id:meat_id}).first()

    if(meat.avatar !== null)
    {
      await diskStorage.deleteFile(meat.avatar)
    }

    const fileName = await diskStorage.saveFile(file)

    meat.avatar = fileName

    await knex
    .select("avatar")
    .from("meats")
    .where({id:meat_id})
    .update(meat)

    return res.json(meat)

  }
}


module.exports = AvatarControllers