const { default: knex } = require("knex")


exports.up = async knex => { 
    
  await knex.schema.createTable("restaurants", table => {

  table.increments("id")
  table.integer("admin_id").references("id").inTable("admins")
  table.string("name")
  table.timestamp("create_at").default(knex.fn.now())

})	
  
};


exports.down = async knex => await knex.schema.dropTable("restaurants")
  

