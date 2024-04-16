const { default: knex } = require("knex")


exports.up = async knex => { 
    
  await knex.schema.createTable("categorys", table => {
   
  table.increments("id")
  table.integer("restaurant_id").references("id").inTable("restaurants").onDelete("CASCADE")
  table.string("name")
  table.timestamp("create_at").default(knex.fn.now())
  table.timestamp("update_at").default(knex.fn.now())
})	
  
};


exports.down = async knex => await knex.schema.dropTable("categorys")
  

