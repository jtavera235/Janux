const jwt = require("jsonwebtoken");
const Startup = require("../models/startup");
const bcrypt = require("bcryptjs");

exports.registerStartup =  (req, res, next) => {
    let newUser;
    bcrypt.hash(req.body.password, 10).then(hash => {
        const startup = new Startup({
            email: req.body.email,
            name: req.body.name,
            password: hash,
            isUser: false,
            edited: 0,
            numberOfLogins: 0,
            description: '',
            emailPermission: false,
            interest: [],
            platform: [],
            url: '',
            lastLogin: req.body.lastLogin
        });
        newUser = startup;
        startup.save().then(result => {
            const token = jwt.sign({ email: newUser.email, userId: result._id }, process.env.JWT_KEY, {expiresIn: '1h'});
            res.status(201).json({
                token: token,
                expiresIn: 3600,
                message: 'startup added successfully',
                userId: result._id,
                user: startup
            });
        }).catch(error => {
            res.status(500).json({
                message: 'Unable to register at the moment. Please try again'
            });
        });
    });
}

exports.updateLogins = (req, res, next) => {
    const loginAmount = {
        numberOfLogins: req.body.numberOfLogins
    };
    Startup.updateOne({_id: req.params.id}, loginAmount).then(result => {
        res.status(200).json({message: 'success'});
    }).catch(err => {
        // do nothing because it is internal error
    }); 
}

exports.updateEdits =  (req, res, next) => {
    const edits = {
       edited: req.body.edited
    };
    Startup.updateOne({_id: req.params.id}, edits).then(result => {
        res.status(200).json({ message: 'success'});
    });
}

exports.updateEmail = (req, res, next) => {
    const startupEmail = {
        email: req.body.email
    };
    Startup.updateOne({_id: req.params.id}, startupEmail).then(result => {
        res.status(200).json({message: 'successful'});
    }).catch(error => {
        res.status(500).json({
            message: 'Unable to reset your email.'
        });
    });
}

exports.updatePassword =  (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        newPassword = {
            password: hash
        };
        Startup.updateOne({_id: req.params.id}, newPassword).then(result => {
            res.status(200).json({message: 'successful'});
        }).catch(err => {
            res.status(500).json({
                message: 'Unable to reset your password'
            });
        }) ;
    });
}

exports.updateStartup = (req, res, next) => {
    const startup = new Startup({
        _id: req.body._id,
        url: req.body.url,
        description: req.body.description,
        interest: req.body.interest,
        edited: req.body.edited,
        platform: req.body.platform,
        emailPermission: req.body.emailPermission
    });
    Startup.updateOne({_id: req.params.id}, startup).then(result => {
        res.status(200).json({ message: 'Update success'});
    }).catch(err => {
        res.status(500).json({
            message: 'Unable to update your account. Please try again'
        });
    });
}

exports.loginStartup = (req, res, next) => {
    let fetchedUser;
    Startup.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                message: 'Incorrect email or password'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Incorrect email or password'
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

exports.postLoginDate = (req, res, next) => {
    const date = {
        lastLogin: req.body.lastLogin
    };
    Startup.updateOne({_id: req.params.id}, date).then(result => {
        res.status(200).json({message: 'login date saved'});
    }).catch(err => {
        console.log('error saving date');
    });
}


exports.getCurrentStartup =  (req, res, next) => {
    Startup.findOne({_id: req.params.id}).then(user => {
        return res.status(200).json({
            message: 'fetched user',
            user: user 
        });
    });
}

exports.getAllStartups = (req, res, next) => {
    let allStartups = [];
    Startup.find().then(documents => {
        for (let i = 0; i < documents.length; i++) {
            let tempStartup = {
                name: documents[i].name,
                email: documents[i].email,
                description: documents[i].description,
                emailPermission: documents[i].emailPermission,
                interest: documents[i].interest,
                platform: documents[i].platform,
                url: documents[i].url
            };
            allStartups.push(tempStartup);
        }
        return res.status(200).json({
            message: 'startups fetched success',
            startups: allStartups
        });
    });
}