var Member = require('../models/member.js');
var VerifyPassword = require('../models/verificationPassword.js');
var Verification = require('../models/verification.js');
var md5 = require('md5');
var uuidV4 = require('uuid/v4');
var nodemailer = require('nodemailer');


var generatepassword = (req, res, next) => {
    var tokenGenerator = uuidV4();
    var email = req.body.email;
    console.log('email check 1');
    console.log(email);
    console.log('email check 2');
    var verificationLink = 'localhost:3000/verifylink/' + tokenGenerator;
    console.log('reaching this stage 1');

    Member.find({
        email: email
    }, function(err, mem) {
        if (mem.length) {
            var verificationCheck = new VerifyPassword({
                token: tokenGenerator,
                counter: 1,
                username: mem[0].username
            }).save();

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'parultestcheck1@gmail.com',
                    pass: 'boldtest12345'
                }
            });

            var mailOptions = {
                from: 'parultestcheck1@gmail.com',
                to: email,
                subject: 'Sending Email using Node.js',
                text: verificationLink
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log('debugging test 1');
                    res.status(500).json({
                        error: 'Email Not Sent'
                    })
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({
                        message: 'Email Successfully sent '
                    })
                }
            });
        } else {
            console.log('debugging test 3');
            res.status(500).json({
                error: 'Email Address doesnot exist '
            })
        }
    })
}

var verifytoken = (req, res, next) => {
    var username = req.params.username;
    var token = req.params.verifytoken;
    VerifyPassword.find({
        token: token
    }, function(err, verified) {
        if (verified.length && verified[0].counter !== 2) {

            res.status(200).json({
                username: verified[0].username
            })
        } else if (verified[0].counter === 2) {

            res.status(500).json({
                messsage: 'verification link expired'
            })
        } else {

            res.status(500).json({
                messsage: 'verification token invalid'
            })

        }


    })


}

var resetpass = (req, res, next) => {
    var username = req.body.username;
    var token = req.body.id;
    VerifyPassword.find({
        token
    }, function(err, verified) {
        console.log(verified[0]);
        if (req.body.pword === req.body.pword2 && verified[0].counter == 1) {

            VerifyPassword.update({
                token: token
            }, {
                $set: {
                    counter: 2
                }
            }, {
                new: true
            }, function(err, doc) {
                console.log('completed');
            })
            Member.update({
                username: username
            }, {
                $set: {
                    password: md5(req.body.pword)
                }
            }, {
                new: true
            }, function(err, upd) {
                console.log('completed 2');
            })

            res.status(200).json({
                message: 'Password Reset Successfull'
            })

        } else if (req.body.pword == req.body.pword2) {
            res.status(500).json({
                message: 'Verification link not valid '
            })
        } else {
            res.status(500).json({
                message: 'Password donot match'
            })
        }
    })


}

var validatetoken = (req, res, next) => {
    var token = req.body.token;
    var household = req.body.household;
    Verification.find({
        token: token
    }, function(err, tokenExists) {
        if (tokenExists) {
            //res.render('register', {household: household});
            res.json({
                household: household
            })

        } else {
            res.status(500).json({
                error: 'Verification token is invalid '
            })
        }

    })



}

var processReg = (req, res, next) => {

    Member.find({
            username: req.body.uname
        })
        .then((mem) => {
            console.log('testing member here first');
            console.log(mem);
            console.log('testing member here second');
            if (mem.length) {
                res.status(401).send({
                    authorized: false,
                    message: 'User Already Exists '
                });
            } else if (req.body.pword.trim() == req.body.pword2.trim()) {

                if (req.body.household) {


                    var newUser = Member({
                        username: req.body.uname,
                        password: md5(req.body.pword),
                        email: req.body.email,
                        type: "household",
                        amount: 0,
                        household: {
                            name: req.body.household
                        }

                    })


                } else {

                    var newUser = Member({
                        username: req.body.uname,
                        password: md5(req.body.pword),
                        email: req.body.email,
                        amount: 0,
                        type: "guest"

                    })

                }

                newUser.save();
                res.status(200).send({
                    authorized: true
                })
            } else {
                res.status(401).send({
                    message: 'Incorrect Password Entered',
                    authorized: false
                });

            }

        })


}

var processLogin = (req, res, next) => {

    checkLogin(req, res, req.body.uname.trim(), req.body.pword.trim())

}

var checkLogin = (req, res, uname, password, next) => {

    Member.findOne({
        username: uname
    }, function(err, userdata) {

        if (!userdata) {
            console.log('debugger 1');
            res.status(404).send({
                error: " User not found"
            });
        } else if (userdata.password == md5(password)) {
            console.log('debugger 2');
            req.session.username = userdata.username;
            res.status(200).json({
                authorized: true,
                username: req.session.username
            });

        } else {
            console.log('debugger 3');
            res.status(401).json({
                authorized: false
            });

        }

    })

}

module.exports = {
    checkLogin,
    processLogin,
    processReg,
    validatetoken,
    resetpass,
    verifytoken,
    generatepassword

}