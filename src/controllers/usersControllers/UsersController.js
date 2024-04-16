const knex = require("../../database/knex")

const { hash } = require("bcryptjs")

const AppError = require("../../utils/AppError")


class UsersController
{
  async create(req, res)
  {
    const { name, email, password } = req.body

    if((name == "" || name == null || name == undefined) || (email == "" || email == null || email == undefined) || (password == "" || password == null || password == undefined))
    {
      throw new AppError("Todos os campos são obrigatórios.")
    }

    const emailExists = await knex("users").where({email}) || await knex("admins").where({email})

    if(emailExists.length > 0)
    {
      throw new AppError("Este email já está em uso.")
    }

    const passwordHashed = await hash(password, 8)

    await knex("users").insert({
      name,
      email,
      password: passwordHashed,
      admin: false
    })

    return res.status(201).json({
      message: "Usuário criado com sucesso."
    })

  }
}


module.exports = UsersController