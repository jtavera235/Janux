const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.returnLoggedInUserData =  (req, res, next) => {
    User.findOne({_id: req.params.id}).then(user => {
        return res.status(200).json({
            message: 'fetched user',
            user: user 
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Unable to retrieve user data'
        });
    });
}

exports.getAllUsers =  (req, res, next) => {
    let allUsers = [];
    User.find().then(documents => {
        for (let i = 0; i < documents.length; i++) {
            let tempUser = {
                name: documents[i].name,
                email: documents[i].email,
                specific: documents[i].specific,
                keywords: documents[i].keywords,
                connectedTo: documents[i].connectedTo,
                interest: documents[i].interest,
                platform: documents[i].platform
            };
            allUsers.push(tempUser);
        }
        return res.status(200).json({
            message: 'users fetched success',
            users: allUsers
        });
    });
}

exports.registerUser = (req, res, next) => {
    let newUser;
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hash,
            isUser: true,
            numberOfEdits: 0,
            numberOfLogins: 0,
            specific: '',
            keywords: '',
            connectedTo: [],
            interest: [],
            platform: [],
            lastLogin: req.body.lastLogin
        });
        newUser = user;
        user.save().then(result => {
            const token = jwt.sign({ email: newUser.email, userId: result._id }, process.env.JWT_KEY, {expiresIn: '1h'});
            res.status(201).json({
                token: token,
                expiresIn: 3600,
                message: 'user added successfully',
                userId: result._id,
                user: user
            });
        }).catch(err => {
            res.status(500).json({
                message: 'Unable to register at the moment. Please try again'
            });
        });
    });
}

exports.loginUser =  (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                message: 'Email or password is incorrect'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Email or password is incorrect'
            });
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY, {expiresIn: '1h'});
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            logins: fetchedUser.numberOfLogins
        });
    }).catch(err => {
        return res.status(404).json({
            message: 'Invalid login'
        });
    });
}

exports.updateLogins = (req, res, next) => {
    const loginAmount = {
        numberOfLogins: req.body.numberOfLogins
    };
    User.updateOne({_id: req.params.id}, loginAmount).then(result => {
        res.status(200).json({message: 'Update successful'});
    }).catch(err => {
    }); 
}

exports.postLoginDate = (req, res, next) => {
    const date = {
        lastLogin: req.body.lastLogin
    };
    User.updateOne({_id: req.params.id}, date).then(result => {
        res.status(200).json({message: 'login date saved'});
    }).catch(err => {
        console.log('error saving date');
    });
}

exports.resetEmail = (req, res, next) => {
    const userEmail = {
        email: req.body.email
    };
    User.updateOne({_id: req.params.id}, userEmail).then(result => {
        res.status(200).json({message: 'Update successful'});
    }).catch(error => {
        res.status(500).json({
            message: 'Unable to reset your email'
        });
    });
}

exports.updateUser = (req, res,next) => {
    const user = new User({
        _id: req.body._id,
        specific: req.body.specific,
        keywords: req.body.keywords,
        interest: req.body.interest,
        numberOfEdits: req.body.numberOfEdits,
        platform: req.body.platform
    });
    User.updateOne({_id: req.params.id}, user).then(result => {
        res.status(200).json({message: 'Update successful'});
    }).catch(err => {
        res.status(500).json({
            message: 'Unable to update your account'
        });
        
    }); 
}

exports.updatePassword = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        newPassword = {
            password: hash
        };
        User.updateOne({_id: req.params.id}, newPassword).then(result => {
            res.status(200).json({message: 'Update successful'});
        }).catch(err => {
            res.status(500).json({
                message: 'Unable to reset your password'
            });
        });
    });
}
