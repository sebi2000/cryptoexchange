const express = require('express')
const server = express()
const Currency = require('../../models/currency')
const isAuth = require('../../middleware/isAuth')
const Wallet = require('../../models/wallet')

server.get('/crypto', isAuth, async (req, res) => {
  const availableCrypto = await Currency.find();

  if (!availableCrypto) {
    res.status(404).json({
      message: "No crypto available",
    })
  } else {
    res.status(200).json({
      availableCrypto,
    })
  }
})

server.get('/crypto-sell', isAuth, async (req, res) => {
  const user = req.session.passport.user;
  const wallet = await Wallet.findOne({ userId: user._id });

  if (!wallet) {
    return res.status(404).json({
      msg: 'Wallet not found'
    });
  }

  const toSell = []
  for (const c of wallet.currency) {
    const currency = await Currency.findById(c.currencyId);
    if (currency.name !== 'xUSD') {
      toSell.push({ name: currency.name, amount: c.amount, price: currency.ratio * c.amount })
    }
  }

  return res.status(200).json(
    toSell
  )
})

module.exports = server
