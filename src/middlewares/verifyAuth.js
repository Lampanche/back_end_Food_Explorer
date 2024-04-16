const AppError = require("../utils/AppError")
const jwtConfig = require("../config/auth")
const { verify } = require("jsonwebtoken")

async function verifyAuth(req, res, next)
{
  const auth = req.headers.authorization

  if(!auth)
  { 
    //res.status(401).json({invalidToken:true})
    throw new AppError("O token do usuário não existe ou expirou.", 401)
  }

  const [, token] = auth.split(" ")

  try 
  {
    const { sub : user_id } = verify(token, jwtConfig.jwt.secret)
    req.user = 
    {
      id:Number(user_id)
    }

    return next()

  } 
  catch 
  {
    //res.status(401).json({invalidToken:true})
    throw new AppError("Token inválido.", 401)
    
  }

}

module.exports = verifyAuth