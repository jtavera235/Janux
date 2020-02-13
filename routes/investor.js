const express = require('express');
const InvestorNews = require("../models/investorNews");
const router = express.Router();

router.post('/newsletter', (req, res, next) => {
    const investorNews = new InvestorNews ({
        email: req.body.email,
        name: req.body.name
    });
    investorNews.save().then(result => {
        res.status(201).json({
            message: 'member added successfully'
        });
    }).catch(error => {
        res.status(500).json({
            err: error
        });
    });
});

module.exports = router;