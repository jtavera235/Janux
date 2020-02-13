const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");

const investorNewsletterSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true}
});

investorNewsletterSchema.plugin(validator);

module.exports = mongoose.model('InvestorNews', investorNewsletterSchema);