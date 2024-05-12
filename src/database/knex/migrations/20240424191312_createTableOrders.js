const { default: knex } = require("knex")


exports.up =  async knex => { 
    
  await knex.schema.createTable("orders", table => {

  table.increments("id")
  table.string("situation")
  table.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
  table.integer("restaurant_id").references("id").inTable("restaurants").onDelete("CASCADE")
  table.timestamp("create_at")
  table.timestamp("update_at")
})	
  
};


exports.down = async knex => await knex.schema.dropTable("orders")
  
