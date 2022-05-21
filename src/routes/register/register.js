const express = require("express")
const Users = require("../../models/users")
const Wallet = require("../../models/wallet")
const Currency = require('../../models/currency')
const passManager = require('../../services/passwordManager')
const { initialAmount } = require('../../constants/values')
const server = express()
server.use(express.json())

server.post('/register', async (req, res) =>{

    const { displayName, username, email, password } = req.body
    const encryptedPassword = await passManager.encryptPassword(password).then(hash => hash)

    const user = {
        displayName,
        username,
        email,
        password: encryptedPassword,
    }

    const foundUser = await Users.findOne({ username });

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
});

module.exports = server
