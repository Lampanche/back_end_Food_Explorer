const { default: knex } = require("knex")


exports.up =  async knex => { 
    
  await knex.schema.createTable("users", table => {

  table.increments("id")
  table.string("name")
  table.string("email")
  table.string("password")
  table.boolean("admin", false)
  table.timestamp("create_at").default(knex.fn.now())
})	
  
};


exports.down = async knex => await knex.schema.dropTable("users")
  

