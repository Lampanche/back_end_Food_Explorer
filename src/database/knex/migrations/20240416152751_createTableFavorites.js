const { default: knex } = require("knex")


exports.up =  async knex => { 
    
  await knex.schema.createTable("favorites", table => {

  table.increments("id")
  table.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
  table.integer("meat_id").references("id").inTable("meats").onDelete("CASCADE")
})	
  
};


exports.down = async knex => await knex.schema.dropTable("favorite")
  

