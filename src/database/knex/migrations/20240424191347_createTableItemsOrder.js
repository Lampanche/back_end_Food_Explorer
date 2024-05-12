const { default: knex } = require("knex")


exports.up =  async knex => { 
    
  await knex.schema.createTable("itemsOrder", table => {

  table.increments("id")
  table.integer("meat_id").references("id").inTable("meats")
  table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE")
  table.integer("quantity")
})	
  
};


exports.down = async knex => await knex.schema.dropTable("itemsOrder")
  

