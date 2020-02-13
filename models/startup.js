const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");

const startupSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    password: { type: String, required: true},
    url: { type: String},
    description: { type: String},
    isUser: { type: Boolean},
    interest: { type: Array},
    edited: { type: Number},
    numberOfLogins: { type: Number},
    platform: { type: Array},
    emailPermission: { type: Boolean},
    lastLogin: {type: String}
});

startupSchema.plugin(validator);

module.exports = mongoose.model('Startup', startupSchema);