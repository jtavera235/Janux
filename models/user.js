const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    password: { type: String, required: true},
    specific: { type: String},
    keywords: { type: String},
    isUser: { type: Boolean},
    connectedTo: { type: Array},
    interest: { type: Array},
    numberOfEdits: { type: Number},
    numberOfLogins: { type: Number},
    platform: { type: Array},
    lastLogin: {type: String}
});

userSchema.plugin(validator);

module.exports = mongoose.model('User', userSchema);