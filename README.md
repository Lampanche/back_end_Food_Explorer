# Back-end - Food Explorer

## Sobre o projeto

API REST feita com Node.js, express, SQLite e Knex.js, para o projeto de conclusão da certificação do progama explorer, da Rocketseat. A API conta com rotas para cadastro de clientes, sessão autenticada, visualização de produtos, pedidos, cadastro de produtos, atualização, deleção e faz integração com a API do mercado pago, para o fluxo de pagamento, por pix e cartão de crédito.


## Deploy

[API Food Explorer](https://food-explorer-api-5nxq.onrender.com)


## Executando localmente

### Instalação

```bash

npm install

```

### Executar

```bash

npm run up_server

```

### Variáveis de ambiente

Crie suas variáveis de acordo com o arquivo => .env.example

### Porta

A API e o servidor socket estarão rodando na porta 5000

### Integração com Mercado Pago

Você deverá criar uma conta no mercado pago e criar a sua aplicação, para ter as credenciais de consumo da API. Com essas informações, você deverá configurar a variável de ambiente correspondente, com o seu TOKEN.

[Doc Mercado pago](https://www.mercadopago.com.br/developers/pt)

### Configuração de notificações de pagamento (Webhook MP)

Você deverá configurar em sua aplicação criada no Mercado pago, na sessão de Webhook, o evento como pagamento e o endpoint da aplicação para receber as notificações.

O endpoint seria http://localhost:5000/notifications, mas o mercado pago precisa que sua url esteja exposta e seja um local seguro, para poder te notificar. Em meus testes utilizei a ferramenta ngrok, para expor a minha aplicação local em um https, onde conseguia receber as notificações.

Para maiores informações, você poderá acessar a documentação do Mercado pago e este link : [ngrok](https://ngrok.com/)

### Tabelas

Caso precise excluir o banco de dados, depois de iniciar o servidor, será necessário criar as tabelas através das migrations configuradas pelo Knex.

### Executar todas as migrações não realizadas

```bash

npx knex migrate:latest

```

## Endpoints

### Admin

```bash

#Criação do admin

POST /admins

#Criação do avatar do restaurante

POST /restaurants/create/:restaurant_id

#Atualização do avatar do restaurante

PATCH /restaurants/up/:restaurant_id

#Criação da refeição

POST /meats/:restaurant_id

#Atualização da refeição

PUT /meats/:meat_id

#Deleção da refeição

DELETE /meats/:meat_id

#Criação do avatar da refeição

POST /meats/avatar/:meat_id

#Atualização do avatar da refeição

PATCH /meats/avatar/:meat_id

#Atualização do status pedido

PATCH /orderHistory/:order_id

#Criação do restaurante

POST /restaurants

#Atualização do restaurante

PUT /restaurants/:restaurant_id

#Deleção do restaurante

DELETE /restaurants/:restaurant_id

#Visualização do restaurante

GET /restaurants/index/:restaurant_id

#Visualização de restaurantes

GET /restaurants/show

```

### User

```bash

#Criação do favorito

POST /favorite/:meat_id

#Visualização dos favoritos

GET /favorite/:restaurant_id

#Visualização do favorito

GET /favorite/index/:meat_id

#Deleção do favorito

DELETE /favorite/:favorite_id

#Criação do pagamento

POST /payments/:restaurant_id

#Criação do usuário

POST /users

```

### Common

```bash

#Visualização das categorias

GET /categorys/:restaurant_id

#Visualização das refeições

GET /meatsViews/show/:restaurant_id

#Visualização da refeição

GET /meatsViews/index/:meat_id

#Visualização dos pedidos

GET /orderHistory/:restaurant_id

#Criação da sessão

POST /session

```

### Notifications

```bash

#Criar notificação (endpoint para o webhook do mp notificar)

POST /notifications

```



