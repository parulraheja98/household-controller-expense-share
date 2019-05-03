var Payment = require('../models/payment');
var Member = require('../models/member');
var uuidV4 = require('uuid/v4');
var nodemailer = require('nodemailer');
var Household = require('../models/household.js');



var householdlist = (req, res, next) => {

    var tokenGenerator = uuidV4();
    console.log('first stage test');
    console.log(process.ENV);
    console.log(req.body);
    var emailAddress = req.body.email;
    var household = req.body.household;
    var verificationLink = 'localhost:85/verificationtoken/' + tokenGenerator + '/' + household;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'parultestcheck1@gmail.com',
            pass: 'boldtest12345'
        }
    });

    var mailOptions = {
        from: 'parultestcheck1@gmail.com',
        to: emailAddress,
        subject: 'Sending Email using Node.js',
        text: verificationLink
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.status(500).json({
                error: error
            })

        } else {

            console.log('Email sent: ' + info.response);
            var testVerification = new Verification({
                token: tokenGenerator
            }).save();

            res.status(200).json({
                completed: true
            });
        }
    });
}

var paymentbyhousehold = (req, res, next) => {
    var householdName = req.params.name;
    Payment.find({
        household: householdName
    }, function(err, paymentInfo) {
        //res.render('paymenthousehold', {payment: paymentInfo, household: householdName});
        res.json({
            payment: paymentInfo,
            household: householdName
        })

    })
}

var addhousehold = (req, res, next) => {
    console.log('checking household body 1');
    console.log(req.body);
    console.log('checking household body 2');
    console.log('checking session 1');
    if (req.session.username === undefined)
        console.log('checking session 2');

    if (req.session && req.session.username !== undefined && req.body.household) {
        householdCreate = new Household({
            name: req.body.household
        }).save();
        Member.update({
            username: req.session.username
        }, {
            $push: {
                household: {
                    name: req.body.household
                }
            }
        }, {
            new: true
        }, function(err, doc) {
            res.json({
                householdCreated: true
            })
        });
    } else if (!req.session.username) {
        res.status(500).json({
            message: 'User not logged in'
        })
    } else {
        console.log('debugger 3');
        res.status(500).json({
            message: 'Household Not Entered as Input'
        })
    }



}

var householdlist = (req, res, next) => {
    Member.find({
        username: req.session.username
    }, function(err, mem) {
        var listMember = mem[0];
        //res.render('listhousehold', {household: listMember.household});
        res.json({
            household: listMember.household
        })
    })


}

var addmember = (req, res, next) => {
    var tokenGenerator = uuidV4();
    console.log('first stage test');
    console.log(process.ENV);
    console.log(req.body);
    var emailAddress = req.body.email;
    var household = req.body.household;
    var verificationLink = 'localhost:85/verificationtoken/' + tokenGenerator + '/' + household;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'parultestcheck1@gmail.com',
            pass: 'boldtest12345'
        }
    });

    var mailOptions = {
        from: 'parultestcheck1@gmail.com',
        to: emailAddress,
        subject: 'Sending Email using Node.js',
        text: verificationLink
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.status(500).json({
                error: error
            })

        } else {

            console.log('Email sent: ' + info.response);
            var testVerification = new Verification({
                token: tokenGenerator
            }).save();

            res.status(200).json({
                completed: true
            });
        }
    });

}


module.exports = {
    householdlist,
    addmember,
    addhousehold,
    paymentbyhousehold,
    householdlist

}