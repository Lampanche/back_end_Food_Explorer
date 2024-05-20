const knex = require("../../database/knex")

const AppError = require("../../utils/AppError")

const moment = require("moment")

class OrdersController
{
  async update(req, res)
  {

    const { order_id } = req.params

    const { status, date } = req.body

    if(!order_id)
    {
      throw new AppError("Sem pedido para atualizar", 400)
    }

    const dateOrderUpdated = moment.utc(date).toISOString()

    await knex("orders").where({id:order_id}).update({

      situation: status,
      update_at: dateOrderUpdated

    })

    return res.status(200).json({message: "Pedido atualizado com sucesso!"})


  }
}

module.exports = OrdersController