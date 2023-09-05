const express = require("express");

const dotenv = require('dotenv');
dotenv.config();
// dotenv.config({ path: './.env.production' });
console.log('env', process.env.NODE_ENV);

const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandlerMiddleware");
const path = require("path");


const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
})
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // change "*" on your domain URL 
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);


//err handlingalways at the endof list
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("Server started on port:", PORT));
  } catch (error) {
    console.log(error);
  }
};

start();

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder, serve static content
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {   
    const index = path.join(__dirname, "client", "build", "index.html");
    res.sendFile(index);
  });
}
