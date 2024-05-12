const knex = require("../../database/knex")

const AppError = require("../../utils/AppError")

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

    const dateOrderUpdated = new Date(date)

    let dateOrderUpdatedTzISO = dateOrderUpdated.getFullYear().toString() + "-"
    dateOrderUpdatedTzISO += (dateOrderUpdated.getMonth() + 1).toString().padStart(2, "0") + "-"
    dateOrderUpdatedTzISO += dateOrderUpdated.getDate().toString().padStart(2, "0") + "T"
    dateOrderUpdatedTzISO += dateOrderUpdated.getHours().toString().padStart(2, "0") + ":"
    dateOrderUpdatedTzISO += dateOrderUpdated.getMinutes().toString().padStart(2, "0") + ":"
    dateOrderUpdatedTzISO += dateOrderUpdated.getSeconds().toString().padStart(2, "0") + "."
    dateOrderUpdatedTzISO += dateOrderUpdated.getMilliseconds().toString().padStart(3, "0")

    await knex("orders").where({id:order_id}).update({

      situation: status,
      update_at: dateOrderUpdatedTzISO

    })

    return res.status(200).json({message: "Pedido atualizado com sucesso!"})


  }
}

module.exports = OrdersController