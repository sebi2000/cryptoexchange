const express = require("express")
const session = require("express-session")
const passport = require("passport")
require("dotenv").config()
const mongoose = require("mongoose")
const isAuth = require("./src/middleware/isAuth.js")
const constants = require("./src/constants/values.js")
const Users = require("./src/models/users.js")
const gitHubRoutes = require("./src/routes/auth/githubOAuth.js")
const googleRoutes = require("./src/routes/auth/googleOAuth.js")
const registerRoutes = require('./src/routes/register/register.js')
const loginRoutes = require('./src/routes/auth/login.js')

const server = express()

mongoose.connect(
  process.env.MONGO_DB_CONN_STRING,
  {
    dbName: "cryptoexchange",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (e) => {
    console.log("db connection", !e ? "successfull" : e);
  }
);

server.use(
  session({
    secret: "cryptoexchangeSecretKey",
    saveUninitialized: false,
    resave: false,
  })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize())
server.use(passport.session())

server.use(googleRoutes)
server.use(gitHubRoutes)
server.use(registerRoutes)
server.use(loginRoutes)

server.get(constants.UNAUTHORIZED_URL, (req, res) => {
  res.status(401).send("Unauthorized, please login");
});

server.use("/api/users/:id", isAuth, async (req, res) => {
  const dbUser = await Users.findOne({ _id: req.params.id});
  if (dbUser) {
    return res.send(dbUser);
  }
  return res.redirect(constants.UNAUTHORIZED_URL);
});

console.log("server at http://localhost:1234/api/");
server.listen(1234);
