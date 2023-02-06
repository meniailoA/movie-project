require("dotenv").config();
require("./middleware/passport");

const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const passport = require("passport");
const upload = require('express-fileupload')


//global root-path variable
global.appRoot = path.resolve(__dirname);

//routes-connection-function
const routesDelivery = require("./routes");

//start-server variables
const PORT = process.env.PORT || 3000;

let app = express();

//ejs
app.set('view engine', 'ejs');

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//file-uploader
app.use(upload())

//route-connection
app = routesDelivery(app);

//jwt-passport
app.use(passport.initialize());

startServer();

function startServer() {
  sequelize.sync().then(() => console.log("database start with no errors"));

  app.listen(PORT, () => {
    console.log(`server  start on port ${PORT}`);
  });
}
