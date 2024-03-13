const { default: knex } = require("knex")


exports.up = async knex => { 
    
  await knex.schema.createTable("meats", table => {
   
  table.increments("id")
  table.integer("restaurant_id").references("id").inTable("restaurants")
  table.string("name")
  table.string("description")
  table.string("price")
  table.string("avatar", null)
  table.timestamp("create_at").default(knex.fn.now())
  table.timestamp("update_at").default(knex.fn.now())

})	
  
};


exports.down = async knex => await knex.schema.dropTable("meats")
  

