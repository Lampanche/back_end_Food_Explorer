const { default: knex } = require("knex")


exports.up = async knex => { 
    
  await knex.schema.createTable("ingredients", table => {
   
  table.increments("id")
  table.integer("restaurant_id").references("id").inTable("restaurants")
  table.integer("meat_id").references("id").inTable("meats").onDelete("CASCADE")
  table.string("name")
  table.timestamp("create_at").default(knex.fn.now())
})	
  
};


exports.down = async knex => await knex.schema.dropTable("ingredients")
  

