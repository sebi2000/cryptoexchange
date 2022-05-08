const mongoose = require('mongoose');

const currencySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },

    ratio: {
        type: Number,
        require: true,
        default: 1
    },

    exchangeAmount: {
        type: Number,
        require: true
    }
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
