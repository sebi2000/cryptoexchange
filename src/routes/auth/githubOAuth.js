var express = require("express");
var passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;
const constants = require("../../constants/values.js");
const Users = require("../../models/users.js");
const Currency = require('../../models/currency')
const Wallet = require('../../models/wallet')
const { initialAmount } = require('../../constants/values')

var server = express();

const GITHUB_CLIENT_ID = "b1cb3875404707d0ca4c";
const GITHUB_CLIENT_SECRET = "a61cc8195dd3dc34107f389ede5943fb3962d3f4";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:1234/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

server.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
server.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: constants.UNAUTHORIZED_URL,
  }),
  async function (req, res) {
    const { id, displayName, username, provider } = req.user;
    const filter = { userId: id, username };
    const entry = {
      ...filter,
      displayName,
      provider,
    };
    const qRes = await Users.findOne(filter);
    if (!qRes) {
      try{
        const xUSD = await Currency.findOne({ 'name': 'xUSD' })
        const userCreated = await Users.create(entry)
        const wallet = await Wallet.create({ 
          userId: userCreated._id,
          currency: [
              {
                  currencyId: xUSD._id,
                  amount: initialAmount
              }
          ]
        })
        res.status(200).json({
            message: "User successfully created",
            user: userCreated,
            wallet
        })
      }
      catch(err) {
        res.status(400).json({ err })
      }
    } else {
      await Users.updateOne(filter, { lastLogin: new Date() })
    }
  }
);

module.exports = server;
