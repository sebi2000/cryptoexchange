const express = require('express');
const server = express();
const Users = require('../../models/users');
const isAuth = require('../../middleware/isAuth');
const passwordManager = require('../../services/passwordManager');

server.post('/profile/change-password', isAuth, async (req, res) => {
    const user = await Users.findById({ _id: req.session.passport.user._id });
    const { confirmOldPass, newPassword } = req.body;

    if (!user) {
        res.status(404).json({
            msg: "User not found"
        })
    } else {
        let confirm;
        await passwordManager.comparePassword(confirmOldPass, user.password).then((result) => {
            confirm = result;
        });
        if (confirm) {
            await Users.findByIdAndUpdate({ _id: req.session.passport.user._id }, { password: await passwordManager.encryptPassword(newPassword) });
            res.status(200).json({
                msg: "password changed successfully"
            })
        }else{
            res.status(402).json({
                msg: "Wrong password"
            })
        }
    }
})

module.exports = server;