const Wallet = require('../models/wallet')
const Users = require("../models/users")
const Currency = require('../models/currency')
const { initialAmount } = require('../constants/values')

const createWallet = async (foundUser, user, res) => {
    if(!foundUser) {
        try{
            const xUSD = await Currency.findOne({ 'name': 'xUSD' })
            const userCreated = await Users.create(user)
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
        res.status(401).json({
            message: "User not created",
        });
    }
}

module.exports = createWallet
