const express = require('express')
const server = express()
const Wallet = require('../../models/wallet')
const isAuth = require('../../middleware/isAuth')

server.get('/wallet', isAuth, async (req, res) => {
    const wallet = await Wallet.find({ userId: req.session.passport.user._id });

    if (!wallet) {
        res.status(404).json({
            msg: "No wallet found"
        })
    } else {
        res.status(200).json({
            wallet
        })
    }
})

module.exports = server
