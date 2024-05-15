const knex = require("../../database/knex")

const MercadoPago = require("../../services/MercadoPago")

class NotificationsPaymentsController
{
  async create(req, res, next)
  { 
    const { data } = req.body

    console.log("RECEBI A NOTIFICAÇÃO")

    req.body = data

    return next()

  }

  async update(req, res, next)
  {

    const data = req.body

    const mercadoPago = new MercadoPago()

    const paymentAtt = await mercadoPago.showPayment(data.id)

    if(!paymentAtt.error)
    {
      const { date_last_updated, status, status_detail, payment_method_id } = paymentAtt

      const dateUpdateMp = new Date(date_last_updated)

      let dateInNowTzISO = dateUpdateMp.getFullYear().toString() + "-"
      dateInNowTzISO += (dateUpdateMp.getMonth() + 1).toString().padStart(2, "0") + "-"
      dateInNowTzISO += dateUpdateMp.getDate().toString().padStart(2, "0") + "T"
      dateInNowTzISO += dateUpdateMp.getHours().toString().padStart(2, "0") + ":"
      dateInNowTzISO += dateUpdateMp.getMinutes().toString().padStart(2, "0") + ":"
      dateInNowTzISO += dateUpdateMp.getSeconds().toString().padStart(2, "0") + "."
      dateInNowTzISO += dateUpdateMp.getMilliseconds().toString().padStart(3, "0")

      await knex("payments").where({id:data.id}).update({
        situation: status,
        update_at: dateInNowTzISO
      })

      const payment = await knex("payments").where({id_mp:paymentAtt.id}).first()

      let message

      if(status == "approved")
      {
        message = "Pagamento aprovado"
      }

      if(status == "rejected" && status_detail == "cc_rejected_other_reason")
      {
        message = "Pagamento rejeitado sem motivo específico"
      }

      if(status == "rejected" && status_detail == "cc_rejected_insufficient_amount")
      {
        message = "Pagamento rejeitado por falta de saldo"
      }

      if(status == "rejected" && status_detail == "cc_rejected_bad_filled_security_code")
      {
        message = "Pagamento rejeitado por problema com o CVC"
      }

      if(status == "rejected" && status_detail == "cc_rejected_bad_filled_date")
      {
        message = "Pagamento rejeitado por problema com a data de vencimento"
      }

      if(status == "rejected" && status_detail == "cc_rejected_bad_filled_card_number")
      {
        message = "Pagamento rejeitado com validação para autorizar"
      }

      if(status == "in_process")
      {
        message = "Pagamento pendente"
      }

      if(payment_method_id == "pix")
      {

        const { point_of_interaction} = paymentAtt

        req.body = {
          payment,
          qrCode: point_of_interaction.transaction_data.qr_code_base64
        }
        
        return next()

      }

      req.body = {
        payment,
        message
      }

      return next()

    }

    req.body = {
      payment: paymentAtt
    }

    return next()

  }

}


module.exports = NotificationsPaymentsController