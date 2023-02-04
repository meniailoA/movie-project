require("dotenv").config();
require("./middleware/passport");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const passport = require('passport')

//routes-connection-function
const routeDelivery = require("./routes/index");

//start-server variables
const PORT = process.env.PORT || 3000;

let app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//route-connection
app = routeDelivery(app);

//jwt
app.use(passport.initialize())


startServer();

function startServer() {
  sequelize.sync().then(() => console.log("database start with no errors"));

  app.listen(PORT, () => {
    console.log(`server  starton port ${PORT}`);
  });
}
