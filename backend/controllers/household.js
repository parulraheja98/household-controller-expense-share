var Payment = require('../models/payment');
var Member = require('../models/member');

var householdlist = (req,res,next) => {

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

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({
                error:error
            })
            
        } else {

            console.log('Email sent: ' + info.response);
            var testVerification = new Verification({
                token: tokenGenerator
            }).save();
        
           res.status(200).json({completed:true});
        }
    });
}

var paymentbyhousehold = (req,res,next) => {
    var householdName = req.params.name;
    Payment.find({household: householdName}, function (err, paymentInfo) {
        //res.render('paymenthousehold', {payment: paymentInfo, household: householdName});
        res.json({
            payment:paymentInfo,
            household:householdName
        })

    })
}

var addhousehold = (req,res,next) => {

    householdCreate = new Household({
        name: req.body.household
    }).save();

    Member.update({username: req.session.username}, {$push: {household: {name: req.body.household}}}, {new: true}, function (err, doc) {
        res.json({
            householdCreated:true
        })
    });
}

var householdlist = (req,res,next) => {
    Member.find({username: req.session.username}, function (err, mem) {
        var listMember = mem[0];
        //res.render('listhousehold', {household: listMember.household});
        res.json({
            household: listMember.household
        })
    })


}

module.exports = {
    householdlist,
    addhousehold,
    paymentbyhousehold,
    householdlist

}