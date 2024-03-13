const knex = require("../../database/knex")

const AppError = require("../../utils/AppError")

const { hash } = require("bcryptjs")

class AdminsController
{
  async create (req, res) 
  {
    const { name, email, password, role } = req.body

    const emailExists = await knex("admins").where({email}) || await knex("users").where({email})

    if(emailExists.lenght > 0)
    {
      throw new AppError("O email já está em uso")
    }

    const passwordHashed = await hash(password, 8)

    await knex("admins").insert({
      name,
      email,
      password: passwordHashed,
      role
    })

    return res.status(201).json()

  }
}


module.exports = AdminsController