const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    guilds: [{
        guildID: { type: String },
    }],
    games: [{
        name: { type: String },
        date: { type: Date, default: Date.now },
    },],
});

module.exports = model('game-logs', logSchema);