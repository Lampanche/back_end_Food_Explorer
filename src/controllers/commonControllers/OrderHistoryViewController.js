const knex = require("../../database/knex")


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

      const orderDateCreate = new Date(order.create_at)

      const orderDateUpdated = new Date(order.update_at)

      let orderDateCreateFormat = orderDateCreate.getDate().toString().padStart(2, "0") + "/"
      orderDateCreateFormat += (orderDateCreate.getMonth() + 1).toString().padStart(2, "0") + " às "
      orderDateCreateFormat += orderDateCreate.getHours().toString().padStart(2, "0") + "h"
      orderDateCreateFormat += orderDateCreate.getMinutes().toString().padStart(2, "0")

      let orderDateUpdateFormat = orderDateUpdated.getDate().toString().padStart(2, "0") + "/"
      orderDateUpdateFormat += (orderDateUpdated.getMonth() + 1).toString().padStart(2, "0") + " às "
      orderDateUpdateFormat += orderDateUpdated.getHours().toString().padStart(2, "0") + "h"
      orderDateUpdateFormat += orderDateUpdated.getMinutes().toString().padStart(2, "0")

      order.create_at = orderDateCreateFormat
      order.update_at = orderDateUpdateFormat

      const paymentsFiltered = payments.filter( payment => payment.order_id == order.id )

      const itemsOrderFiltered = itemsOrderAll.filter( item => item.order_id == order.id )

      const userOrder = users.filter( user => order.user_id == user.id )

      const paymentsFilteredDateFormat = paymentsFiltered.map( paymentFiltered => {

        const dateCreate = new Date(paymentFiltered.create_at)

        const dateUp = new Date(paymentFiltered.update_at)

        let dateCreateFormat = dateCreate.getDate().toString().padStart(2, "0") + "/"
        dateCreateFormat += (dateCreate.getMonth() + 1).toString().padStart(2, "0") + " às "
        dateCreateFormat += dateCreate.getHours().toString().padStart(2, "0") + "h"
        dateCreateFormat += dateCreate.getMinutes().toString().padStart(2, "0")

        let dateUpdateFormat = dateUp.getDate().toString().padStart(2, "0") + "/"
        dateUpdateFormat += (dateUp.getMonth() + 1).toString().padStart(2, "0") + " às "
        dateUpdateFormat += dateUp.getHours().toString().padStart(2, "0") + "h"
        dateUpdateFormat += dateUp.getMinutes().toString().padStart(2, "0")

        paymentFiltered.create_at = dateCreateFormat

        paymentFiltered.update_at = dateUpdateFormat

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