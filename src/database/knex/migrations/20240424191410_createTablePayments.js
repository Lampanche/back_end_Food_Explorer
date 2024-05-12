const { default: knex } = require("knex")


exports.up =  async knex => { 
    
  await knex.schema.createTable("payments", table => {
  
  table.increments("id")
  table.integer("id_mp")
  table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE")
  table.string("typePayment")
  table.float("amount", 8, 2)
  table.string("situation")
  table.timestamp("create_at")
  table.timestamp("update_at")
})	
  
};


exports.down = async knex => await knex.schema.dropTable("payments")
  

