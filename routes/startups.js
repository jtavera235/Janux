const express = require('express');
const Startup = require("../models/startup");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const StartupController = require("../controllers/startup");

// post a complete startup to db
router.post('', (req, res, next) => {
    const startup = new Startup({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        url: req.body.url,
        description: req.body.description,
        isUser: req.body.isUser,
        emailPermission: req.body.emailPermission,
        interest: req.body.interest,
        edited: req.body.edited,
        numberOfLogins: req.body.numberOfLogins,
        platform: req.body.platform
    });
    startup.save().then(result => {
        res.status(201).json({
            message: 'startup added successfully',
            startupId: result._id
        });
    });
});



// register a startup
router.post('/register', StartupController.registerStartup);

// updates number of logins of a startup
router.put('/logins/:id', checkAuth, StartupController.updateLogins);

// update number of edits
router.put("/edits/:id", checkAuth, StartupController.updateEdits);

// resets an email
router.put('/resetEmail/:id', checkAuth, StartupController.updateEmail);

router.put('/resetPassword/:id', checkAuth, StartupController.updatePassword);

// update startup info
router.put("/:id", checkAuth, StartupController.updateStartup);

router.put("/login/date/:id", StartupController.postLoginDate);
// Login a startup
router.post("/login", StartupController.loginStartup);


// get startup info
router.get('/:id', StartupController.getCurrentStartup);

// get all startups
router.get('', checkAuth, StartupController.getAllStartups);

module.exports = router;