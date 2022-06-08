const express = require('express')
const server = express()
const Currency = require('../../models/currency')
const isAuth = require('../../middleware/isAuth')
const Wallet = require('../../models/wallet')
const CurrencyHistory = require('../../models/currencyHistory')

server.get('/crypto', isAuth, async (req, res) => {
  const availableCrypto = await Currency.find();

  if (!availableCrypto) {
    return res.status(404).json({
      message: "No crypto available",
    })
  }

  const toBuy = []
  for (const c of availableCrypto) {
    if (c.name !== 'xUSD') {
      toBuy.push(c)
    }
  }

  return res.status(200).json({
    toBuy,
  })
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
      toSell.push({ _id: currency._id, name: currency.name, amount: c.amount, price: currency.ratio * c.amount })
    }
  }

  return res.status(200).json({
    toSell,
  })
})

server.get('/currency-history', isAuth, async (req, res) => {
  const { name } = req.body;
  const currency = await Currency.findOne({ name: name });
  const history = await CurrencyHistory.findOne(currency._id);

  if (!history || !currency) {
    return res.status(404).json({
      msg: 'Currency not found'
    })
  }

  return res.status(200).json({
    ratio: history.ratio
  });
})

module.exports = server
