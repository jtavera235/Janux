const express = require('express');
const User = require("../models/user");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const UserController = require("../controllers/user");



// returns logged in user data 
router.get('/:id', UserController.returnLoggedInUserData);


// get all users
router.get('', checkAuth, UserController.getAllUsers);

// post a complete user to database
// never used in production
router.post('', (req, res, next) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        specific: req.body.specific,
        keywords: req.body.keywords,
        isUser: req.body.isUser,
        connectedTo: req.body.connectedTo,
        interest: req.body.interest,
        numberOfEdits: req.body.numberOfEdits,
        numberOfLogins: req.body.numberOfLogins,
        platform: req.body.platform
    });
    user.save().then(result => {
        res.status(201).json({
            message: 'user added successfully',
            userId: result._id
        });
    });
});


// add a user after signing up
router.post('/register', UserController.registerUser);


// validates log in and logs in user
router.post("/login", UserController.loginUser);


router.put("/login/date/:id", UserController.postLoginDate);

// updates number of logins of a user
router.put('/logins/:id', checkAuth, UserController.updateLogins);


// updates connected list
// This is not being used for production
router.put('/connected/:id', checkAuth, (req, res, next) => {
    const connected = {
        connectedTo: req.body.connectedTo
    };
    User.updateOne({_id: req.params.id}, connected).then(result => {
        res.status(200).json({message: 'Update successful'});
    }).catch(err => {
    }); 
});

// resets user email
router.put('/resetEmail/:id', checkAuth, UserController.resetEmail);

// resets user's password
router.put('/resetPassword/:id', checkAuth, UserController.updatePassword);

// updates user
router.put("/:id", checkAuth, UserController.updateUser);




module.exports = router;
