const express = require("express")
const Users = require("../../models/users")
const passManager = require('../../services/passwordManager')
const server = express();
server.use(express.json());

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
        await Users.create({...user}).then(user =>
            res.status(200).json({
                message: "User successfully created",
                user,
            })
        )
    } else {
        res.status(401).json({
            message: "User not created",
        });
    }
});

module.exports = server
