require("express-async-errors")

const express = require("express")

const dbConection = require("./database/sqlite")

const routes = require("./routes")

const AppError = require("./utils/AppError")

const configUploads = require("./config/upload")

const cors = require("cors")

const app = express()

dbConection()

app.use(cors())

app.use(express.json())

app.use(routes)

app.use("/file", express.static(configUploads.UPLOADS_FOLDER))

app.use((error, request, response, next)=>{

  if(error instanceof AppError)
  {
    response.status(error.status).json({
      message: error.message
    })
  }else
  {
    response.status(500).json({
      message: "Internal server error"
    })
    console.log(error)
  }
    
})

const port = 5000

app.listen(port, () => console.log(`Server is runing in port:${port}`))