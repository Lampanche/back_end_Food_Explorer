const knex = require("../../database/knex")

const moment = require("moment")

class OrderHistoryViewController
{
  async show(req, res)
  {
    const user_id = req.user.id

    const { restaurant_id } = req.params

    const orders = await knex("orders").where({user_id}).andWhere({restaurant_id})

    const itemsOrderAll = await knex("itemsOrder")

    const payments = await knex("payments")

    const users = await knex("users")

    const ordersIncludesItemsAndPaymentsPromisses = orders.map( async order  => {

      const orderDateCreate = moment(order.create_at).utcOffset(-3).format("DD/MM à HH:mm")

      const orderDateCreateFormat = orderDateCreate.replace("à", "ás")

      const orderDateUpdated = moment(order.update_at).utcOffset(-3).format("DD/MM à HH:mm")

      const orderDateUpdatedFormat = orderDateUpdated.replace("à", "ás")

      order.create_at = orderDateCreateFormat
      order.update_at = orderDateUpdatedFormat

      const paymentsFiltered = payments.filter( payment => payment.order_id == order.id )

      const itemsOrderFiltered = itemsOrderAll.filter( item => item.order_id == order.id )

      const userOrder = users.filter( user => order.user_id == user.id )

      const paymentsFilteredDateFormat = paymentsFiltered.map( paymentFiltered => {

        const dateCreate = moment(paymentFiltered.create_at).utcOffset(-3).format("DD/MM à HH:mm")

        const dateCreateFormat = dateCreate.replace("à", "ás")

        const dateUp = moment(paymentFiltered.update_at).utcOffset(-3).format("DD/MM à HH:mm")

        const dateUpFormat = dateUp.replace("à", "ás")

        paymentFiltered.create_at = dateCreateFormat

        paymentFiltered.update_at = dateUpFormat

        if(paymentFiltered.situation == "approved")
        {
          paymentFiltered.situation = `Aprovado`
          return paymentFiltered
        }

        if(paymentFiltered.situation == "rejected")
        {
          paymentFiltered.situation = `Rejeitado`
          return paymentFiltered
        }

        if(paymentFiltered.situation == "in_process" || paymentFiltered.situation == "pending")
        {
          paymentFiltered.situation = `Pendente`
          return paymentFiltered
        }

        return paymentFiltered

      })

      const meatsPromisses = itemsOrderFiltered.map( async itemOrderFiltered => {

        const meat = await knex("meats").where({id:itemOrderFiltered.meat_id}).first()

        return {
          name: meat.name,
          quantity: itemOrderFiltered.quantity
        }

      })

      const meats = await Promise.all(meatsPromisses)

      const meatsFormat = meats.map( (meat, index) => {

        let item

        if(index > 0)
        {
          item = ` ${meat.quantity} x ${meat.name}`
          return item
        }

        item = `${meat.quantity} x ${meat.name}`
        return item

      })

      return{
        order,
        payment: paymentsFilteredDateFormat[0],
        items: meatsFormat,
        user: userOrder[0]
      }

    })

    const ordersIncludesItemsAndPayments = await Promise.all(ordersIncludesItemsAndPaymentsPromisses)

    return res.status(200).json(ordersIncludesItemsAndPayments)

  }
}

module.exports = OrderHistoryViewController