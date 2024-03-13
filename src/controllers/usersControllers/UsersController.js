const knex = require("../../database/knex")

const { hash } = require("bcryptjs")

const AppError = require("../../utils/AppError")


class UsersController
{
  async create(req, res)
  {
    const { name, email, password } = req.body

    const emailExists = await knex("users").where({email}) || await knex("admins").where({email})

    if(emailExists.length > 0)
    {
      throw new AppError("Este email já está em uso.")
    }

    const passwordHashed = await hash(password, 8)

    const role = "user"

    await knex("users").insert({
      name,
      email,
      password: passwordHashed,
      role
    })

    return res.status(201).json()

  }
}


module.exports = UsersController