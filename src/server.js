require("express-async-errors");

require("dotenv/config");

const { Server } = require("socket.io");

const cluster = require('node:cluster');

const process = require("node:process");

const numCPUs = require('os').cpus().length;

const express = require("express");

const dbConection = require("./database/sqlite");

const routes = require("./routes");

const AppError = require("./utils/AppError");

const configUploads = require("./config/upload");

const cors = require("cors");

const app = express()

dbConection()

app.use(cors({origin:["https://food-explorer-lampa.netlify.app", "http://localhost:5173"]}))

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

let wss

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  
  const server = app.listen(port, () => console.log(`Server is runing in port:${port}`))
  
  wss = new Server(server, {cors:{origin: ["https://food-explorer-lampa.netlify.app", "http://localhost:5173"]}})

  console.log(`Worker ${process.pid} started`);
}


app.use("/notifications", (req, res, next) => {

  const payment = req.body

  if(payment.error)
  {
    
    wss.emit("attPayment", payment.error)

    return res.status(200).json()

  }
  
  wss.emit("attPayment", payment)

  return res.status(200).json()

})





