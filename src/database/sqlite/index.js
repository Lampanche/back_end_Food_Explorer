const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")


async function dbConection()
{
    await sqlite.open({
        filename: path.resolve(__dirname, "..", "database.db"),
        driver: sqlite3.Database
    })
}

module.exports = dbConection