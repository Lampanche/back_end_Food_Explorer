const MercadoPago = require("../../services/MercadoPago.js")

const AppError = require("../../utils/AppError.js")

const knex = require("../../database/knex")

const moment = require("moment")

class PaymentsController
{
  async create(req, res)
  {
    const { email, name, amount, methodPayment, itemsOrder } = req.body

    const { restaurant_id } = req.params

    const user_id = req.user.id

    if(amount <= 0)
    {
      throw new AppError("O valor da compra deverá ser maior que 0", 400)
    }

    const mercadoPago = new MercadoPago()

    const payment = await mercadoPago.createPayment(name, email, amount, methodPayment)

    if(payment.error || payment.status == '500')
    {
      throw new AppError(`${payment.message}`, Number(payment.status))
    }

    //const dateCreatedMp = new Date(payment.date_created)

    const dateMpInUTC = moment.utc(payment.date_created).toISOString()

    /*
    let dateInNowTzISO = dateCreatedMp.getFullYear().toString() + "-"
    dateInNowTzISO += (dateCreatedMp.getMonth() + 1).toString().padStart(2, "0") + "-"
    dateInNowTzISO += dateCreatedMp.getDate().toString().padStart(2, "0") + "T"
    dateInNowTzISO += dateCreatedMp.getHours().toString().padStart(2, "0") + ":"
    dateInNowTzISO += dateCreatedMp.getMinutes().toString().padStart(2, "0") + ":"
    dateInNowTzISO += dateCreatedMp.getSeconds().toString().padStart(2, "0") + "."
    dateInNowTzISO += dateCreatedMp.getMilliseconds().toString().padStart(3, "0")
    */
    const newOrder = await knex("orders").insert({
      user_id,
      situation: "Pendente",
      restaurant_id,
      create_at: dateMpInUTC,
      update_at: dateMpInUTC
    })
      
    itemsOrder.forEach( async item  => {
      await knex("itemsOrder").insert({
        meat_id:item.id,
        order_id:newOrder[0],
        quantity:item.quantity
      })

    })

    await knex("payments").insert({
      id_mp: payment.id,
      order_id:newOrder[0],
      typePayment: payment.payment_method_id,
      amount,
      situation: payment.status,
      create_at: dateMpInUTC,
      update_at: dateMpInUTC
    })

    let message

    if(payment.status == "approved")
    {
      message = "Pagamento aprovado"
    }

    if(payment.status == "rejected" && payment.status_detail == "cc_rejected_other_reason")
    {
      message = "Pagamento rejeitado sem motivo específico"
    }

    if(payment.status == "rejected" && payment.status_detail == "cc_rejected_insufficient_amount")
    {
      message = "Pagamento rejeitado por falta de saldo"
    }

    if(payment.status == "rejected" && payment.status_detail == "cc_rejected_bad_filled_security_code")
    {
      message = "Pagamento rejeitado por problema com o CVC"
    }

    if(payment.status == "rejected" && payment.status_detail == "cc_rejected_bad_filled_date")
    {
      message = "Pagamento rejeitado por problema com a data de vencimento"
    }

    if(payment.status == "rejected" && payment.status_detail == "cc_rejected_bad_filled_card_number")
    {
      message = "Pagamento rejeitado com validação para autorizar"
    }

    if(payment.status == "in_process")
    {
      message = "Pagamento pendente"
    }


    return res.status(201).json({payment, message})

  }

}


module.exports = PaymentsController