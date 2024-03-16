const { default: knex } = require("knex")


exports.up = async knex => { 
    
  await knex.schema.createTable("admins", table => {

  table.increments("id")
  table.string("name")
  table.string("email")
  table.string("password")
  table.boolean("admin", true)
  table.timestamp("create_at").default(knex.fn.now())
   
})	
  
};


exports.down = async knex => await knex.schema.dropTable("admins")
  

