const express = require("express")
const Users = require("../../models/users")
const passManager = require('../../services/passwordManager')
const server = express()
server.use(express.json())

server.post("/auth/login", async (req, res) => {

  const { username, password } = req.body
  const foundUser = await Users.findOne({ username })

  if (!foundUser) {
    res.status(401).json({
      message: "Login not successful",
    })
  } else if (foundUser.provider !== 'default'){
    res.status(401).json({
        message: `Login with your ${foundUser.provider} account!`,
    })
  } else {
    const valid = await passManager.comparePassword(password, foundUser.password).then(resp => resp)

    if (!valid) {
      res.status(402).json({
        message: "Incorrect password!",
      })
    } else {
        await Users.updateOne(foundUser, { lastLogin: new Date() });
        res.status(200).json({
          message: "Login successful",
          foundUser,
        });
    }
  }
});

module.exports = server;
