require('dotenv').config();
const express = require ('express');
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlerMiddleware');
const path = require('path')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static((path.resolve(__dirname,'static'))))
app.use(fileUpload({}))
app.use('/api', router)

//обработка ошибок всегда в конце списка
app.use(errorHandler)


// app.get('/', (req, res) =>{
//     res.status(200).json({message: 'working!!!'})
// })

const start = async ()=> {
    try {
       await sequelize.authenticate()
       await sequelize.sync()
        app.listen(PORT, ()=> console.log('Server started on port:',PORT))
    } catch (error) {
        console.log(error)
    }
}

start()


process.env.NODE_ENV="production";
// process.env.NODE_ENV="development";

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder, serve static content
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    const index = path.join(__dirname, "client", 'build', 'index.html');
    res.sendFile(index);
  });
}