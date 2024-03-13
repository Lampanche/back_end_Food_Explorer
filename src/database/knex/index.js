const knex = require("knex")

const configKnex = require("../../../knexfile")

const knexConectDb = knex(configKnex.development)


module.exports = knexConectDb