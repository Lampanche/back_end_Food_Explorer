const {  MercadoPagoConfig, Payment } = require("mercadopago")

const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN_MP });
const payments = new Payment(client);

class MercadoPago
{ 

  async createPayment(name, email, amount, methodPayment)
  {

    let randomStr

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    const charactersLength = characters.length
  
    for(let i = 0; i < 20; i++) {
      randomStr += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    let body

    if(methodPayment.id === "pix")
    {
      body = {
        additional_info: {
          payer: {
            first_name: name, 
          },
        },
        payer: {
          email: email,
        },
        payment_method_id: methodPayment,
        transaction_amount: amount
      }

      const requestOptions = { idempotencyKey: randomStr }

      return await payments.create({body, requestOptions}).catch(error => error)

    }

    body = {
      additional_info: {
        payer: {
          first_name: name, 
        },
      },
      payer: {
        email: email
      },
      payment_method_id: methodPayment.id,
      transaction_amount: amount,
      installments: methodPayment.installments,
      issuer_id: methodPayment.issuer_id,
      token: methodPayment.token
      
    }


    const requestOptions =  { idempotencyKey: randomStr }

    return await payments.create({body, requestOptions}).catch(error => error)

  }

  async showPayment(idPayment)
  { 

    let response

    try 
    {
      response = await payments.get({id:idPayment})  
    } 
    catch (error) 
    {
      response = error
    }

    return response
  }

}

module.exports = MercadoPago
  