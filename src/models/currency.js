const mongoose = require('mongoose');

const currencySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    ratio: {
        type: Number,
        default: 1
    },

    exchangeAmount: {
        type: Number,
        default: 1,
    }
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
