const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    games: [{
        name: { type: String },
        date: { type: Date, default: Date.now },
    }],
});

module.exports = model('Log', logSchema);