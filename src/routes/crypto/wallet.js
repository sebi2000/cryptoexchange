const express = require('express')
const server = express()
const Currency = require('../../models/currency')
const Wallet = require('../../models/wallet')
const isAuth = require('../../middleware/isAuth')

server.get('/wallet', isAuth, async (req, res) => {
    const wallet = await Wallet.find({
        userId: req.session.passport.user._id
    });

    if (!wallet) {
        return res.status(404).json({
            msg: "No wallet found"
        })
    }
    return res.status(200).json({
        wallet
    })
})

module.exports = server

server.put("/funds", isAuth, async (req, res) => {
    const {
        amount
    } = req.body;
    const wallet = await Wallet.findOne({
        userId: req.session.passport.user._id
    });
    const xUSD = await Currency.findOne({
        "name": "xUSD"
    })

    const totalAmount = wallet.currency[0].amount + amount

    await Wallet.findOneAndUpdate({
        userId: req.session.passport.user._id,
        "currency.currencyId": xUSD._id
    }, {
        $set: {
            "currency.$.amount": totalAmount
        },
    })

    res.status(200).json({
        message: "Succesful deposit",
        wallet
    })
})