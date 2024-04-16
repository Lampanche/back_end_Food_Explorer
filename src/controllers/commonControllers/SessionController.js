const knex = require("../../database/knex")
const AppError = require("../../utils/AppError")
const jwtConfig = require("../../config/auth")
const { compare } = require("bcryptjs")

const { sign } = require("jsonwebtoken")

class SessionController
{
  async create(req, res)
  {
    const { email, password } = req.body

    const user = await knex("users").where({email}).first() || await knex("admins").where({email}).first()

    console.log(user)

    if(!user)
    {
      throw new AppError("Este usuário não existe.", 401)
    }

    const matchPassword = await compare(password, user.password)

    if(!matchPassword)
    {
      throw new AppError("Este usuário não existe", 401)
    }

    const { secret, expiresIn } = jwtConfig.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return res.status(201).json({user, token})


  }
}


module.exports = SessionController