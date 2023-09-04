const express = require("express");

const dotenv = require('dotenv');
dotenv.config({ path: './.env.development' });
console.log('env',process.env.NODE_ENV);

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
//   res.header("Access-Control-Allow-Origin", "*"); // замінити "*" на конкретний URL свого домена
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

// //перенести через роутер
// app.post("/send-data", async (req, res) => {
//   const data = req.body.data;
//   console.log("Data received:", data);

//   // Додаємо обробку даних тут, можна викликати зовнішній файл, наприклад:
//   const getOneResult = require("./getone2.js");
//   const result = await getOneResult(data);
//   // console.log("result: ", result);
//   result !== {} && res.json({ result: result });
// });

// app.post("/send-all-data", async (req, res) => {
//   const data = req.body;
//   console.log("Data received:", data);

//   const getAllResults = require("./get2.js");
//   const result = await getAllResults(data);
//   // console.log("result: ", result);
//   result !== {} && res.json({ result: result });
// });

//обработка ошибок всегда в конце списка
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

// process.env.NODE_ENV = "production";
// process.env.NODE_ENV="development";

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder, serve static content
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    const index = path.join(__dirname, "client", "build", "index.html");
    res.sendFile(index);
  });
}
