const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const gitHubRoutes = require("./src/routes/auth/githubOAuth.js");
const googleRoutes = require("./src/routes/auth/googleOAuth.js");
const mongoose = require("mongoose");
const isAuth = require("./src/middleware/isAuth.js");
const constants = require("./src/constants/values.js");
const Users = require("./src/models/users.js");
const Currency = require("./src/models/currency.js");
const registerRoutes = require('./src/routes/register/register.js')
const loginRoutes = require('./src/routes/auth/login.js')
const cryptoRoutes = require('./src/routes/crypto/crypto')
const profileRoutes = require('./src/routes/profile/profile')
const transactionRoutes = require('./src/routes/transaction/transaction')
const walletRoutes = require('./src/routes/crypto/wallet')
const cors = require('cors')

const server = express();

mongoose.connect(
  process.env.MONGO_DB_CONN_STRING,
  {
    dbName: "cryptoexchange",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (e) => {
    console.log("db connection", !e ? "successfull" : e);
    if (!e) {
      Currency.countDocuments({}, (err, count) => {
        if (err) console.log(err);
        else {
          if (!count) {
            createCurrency();
          }
        }
      })

    }
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
server.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}))
server.use(gitHubRoutes)
server.use(googleRoutes)
server.use(registerRoutes)
server.use(loginRoutes)
server.use(cryptoRoutes)
server.use(profileRoutes)
server.use(walletRoutes)
server.use(transactionRoutes)

server.get(constants.UNAUTHORIZED_URL, (req, res) => {
  res.status(401).send("Unauthorized, please login");
});

server.use("/api/users/:id", isAuth, async (req, res) => {
  const dbUser = await Users.findById(req.params.id);
  if (dbUser) {
    return res.send(dbUser);
  }
  return res.redirect(constants.UNAUTHORIZED_URL);
});

console.log("server at http://localhost:1234/api/");
server.listen(1234);

// initial seeding
const createCurrency = async () => {
  const currencyList = [
    {
      name: "xUSD",
    },
    {
      name: "Bitcoin (BTC)",
      ratio: 2.5,
      exchangeAmount: 1000000
    },
    {
      name: "Ethereum (ETH)",
      ratio: 2.0,
      exchangeAmount: 2100000
    },
    {
      name: "Tether (USDT)",
      ratio: 2.2,
      exchangeAmount: 1500000
    },
    {
      name: "BNB (BNB)",
      ratio: 1.9,
      exchangeAmount: 1900000
    },
    {
      name: "USD Coin (USDC)",
      ratio: 0.99,
      exchangeAmount: 1200000
    },
    {
      name: "XRP (XRP)",
      ratio: 0.7,
      exchangeAmount: 2000000
    }
  ];

  await Currency.insertMany(currencyList);
}
