const express = require("express")
const res = require("express/lib/response")
const passport = require("passport")
const LocalStrategy = require('passport-local')
const Users = require("../../models/users")
const passManager = require('../../services/passwordManager')
const server = express()
server.use(express.json())

passport.use(
  new LocalStrategy(
  (username, password, done) => {
    Users.findOne({ username: username }, async (err, user) => { 
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      
      const valid = await passManager.comparePassword(password, user.password).then(resp => resp)
      
      if(valid){
        await Users.updateOne(user, { lastLogin: new Date() })
        done(null, user)
      }
      else return done(null, false)
    });
  }
));

passport.serializeUser( (user, done) => {
  done(null, user.id)
})

passport.deserializeUser( (obj, done) => {
  done(null, obj)
})

server.post('/auth/login', passport.authenticate('local', { 
  failureFlash: true
}), 
  (req, res) => {
  res.redirect(`/api/users/${req.session.passport.user.id}`)
})

module.exports = server;