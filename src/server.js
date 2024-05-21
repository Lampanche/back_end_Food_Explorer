require("express-async-errors");

require("dotenv/config");

const { Server } = require("socket.io");

const express = require("express");

const dbConection = require("./database/sqlite");

const routes = require("./routes");

const AppError = require("./utils/AppError");

const configUploads = require("./config/upload");

const cors = require("cors");


const app = express();

dbConection();

app.use(cors({origin:"https://food-explorer-lampa.netlify.app"}));

app.use(express.json());

app.use(routes);

app.use("/file", express.static(configUploads.UPLOADS_FOLDER));

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
    
});

const port = 5000;

const server = app.listen(port, () => console.log(`Server is runing in port:${port}`));

const wss = new Server( server, {cors:{origin: "https://food-explorer-lampa.netlify.app" } } );


wss.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);
});

app.use("/notifications", (req, res, next) => {

  const payment = req.body

  if(payment.error)
  {
    
    wss.emit("attPayment", payment.error)

    return res.status(200).json()

  }
  
  wss.emit("attPayment", payment)

  return res.status(200).json()

});




