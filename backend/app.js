var express = require('express'),
    handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var mongoose = require('mongoose');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');
var app = express();
var cors = require('cors');
var moment = require('moment');
var credentials = require('./credentials.js');
var user = require('./models/user');
var question = require('./models/question.js');
var Payment = require('./models/payment');
var Member = require('./models/member.js');
var Verification = require('./models/verification.js');
var VerifyPassword = require('./models/verificationPassword.js');
var Household = require('./models/household.js');
var cookieSession = require('cookie-session');
var nodemailer = require('nodemailer');
var uuidV4 = require('uuid/v4');
var authenticationController = require('./controllers/authentication.js');
var paymentController = require('./controllers/payment.js');
var householdController = require('./controllers/household.js');
var counter = 0;


var md5 = require('md5');

var h = 0;
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        debug: function () {
            console.log("Current Context");
            console.log("=================");
            console.log(this);
            return null
        },
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3017);
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());
app.set('trust proxy', 1)
app.use(
    cookieSession({
        secret: 'keyboard cat',
        name: 'session',
        keys: ['key1', 'key2'],
        cookie: {secure: true}

    }))
    
app.use(cors({credentials:true, origin:'http://localhost:85'}))

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(express.static(__dirname + '/public'));

const dotenv = require('dotenv');
dotenv.config();



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'parultestcheck1@gmail.com',
        pass: 'boldtest12345'
    }
});

var mailOptions = {
    from: 'parultestcheck1@gmail.com',
    to: 'parulraheja98@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};







app.get('/paymentinformation',paymentController.paymentinformation);

app.get('/memberinformation/:paymentid',paymentController.memberinfo);


/*

app.get('/memberinfo/:paymentId', function (req, res) {
    var paymentId = req.params.paymentId;
    var paymentInfo = [];
    var checking = {};
    var amountDue = {};
    console.log(paymentId);
    Member.find({}, function (err, mem) {
        mem.forEach(function (d) {
            d.payment.forEach(function (paymentDetails,ind) {
                if (paymentDetails.paymentId === paymentId) {
                   
                    console.log('payment details check 1');
                    console.log(paymentDetails);
                    var paymentFinalDetails = {
                        paymentDetails,
                        user:d.username
                    }
                    
                    console.log('payment details check 2');
                    paymentInfo.push(paymentFinalDetails);

                }
            })


        })

    }).then(function(r) {
        Payment.find({paymentId: paymentId}, function (err, paymentDetails) {
            amountDue['amount'] = paymentDetails[0].amountDue;
            console.log('before test');
            console.log(paymentDetails);
            console.log('after test');
            console.log('debuggger test 1');
        }).then(function (r) {
            console.log('test debugger payment');
            console.log(r);
            console.log('test debugger payment 2');
           
          res.json({
                paymentInfo: paymentInfo,
                amountDue: amountDue
            })



        })
    })
})

*/

app.post('/generatepassword',authenticationController.generatepassword);

app.get('/verifypassword/:verifytoken',authenticationController.verifytoken);

app.post('/resetpass',authenticationController.resetpass);


/*

Will depend on the layout of the design IF we want the post request or get request

 */


 app.post('/addmember',householdController.addmember);

 app.post('/validatetoken',authenticationController.validatetoken);

app.post('/paymentpage',paymentController.paymentpage);

app.get('/transactioninfo',paymentController.transactioninfo);

app.post('/transactionpayment',paymentController.transactionpayment);

app.get('/paymentbyhousehold/:name',householdController.paymentbyhousehold);


app.get('/getpayment' , function(req,res) {


Member.find({username:req.session.username} ,function(err,mem) {
    console.log('mem check 1');
    console.log(mem);
    console.log('mem check 2');
    res.status(200).json({
        mem
    });

})

});

app.post('/addhousehold',householdController.addhousehold);

app.get('/householdlist',householdController.householdlist);

app.post('/makepayment',paymentController.makepayment);




app.post('/makepayment', function (req, res) {

    var amount = req.body.amount;
    var type = req.body.type;
    var paymentId = req.body.paymentId;
    var household = req.body.household;
    var date = req.body.date;
    var personList = req.body.person;

    console.log('person check ');
    console.log(req.body.person);
    console.log('person check 1');
    console.log('important test');
    console.log(date);
    console.log('important test 1');
    var personSel = [];
    personSel.push({username: req.session.username});
    if (typeof personList === "string") {
        personSel.push({username: personList});

    }
    else {
        personList.forEach(function (d) {
            var personCreate = {username: d};
            personSel.push(personCreate);
        })

    }

    console.log('testing debugger 1');
    console.log(personSel);
    console.log('testing debugger 2');


    Member.find({$or: personSel}, function (err, mem) {
        console.log('member test 1')
        console.log(mem);
        console.log('member test 2')
        var getMembersLength = personSel.length
        console.log('debugger check 1');
        console.log(mem.length);
        console.log('debugger check 2');
        //var getMembersLength = mem.length;
        var paymentShare = amount / getMembersLength;
        var updAmount = amount - paymentShare;
        var payment = new Payment({
            paymentId: paymentId,
            paymentType: type,
            amountDue: updAmount,
            paymentDate: date,
            lender: req.session.username,
            household: household
        }).save();

        mem.forEach(function (memberLis, i) {
            console.log('test 1');
            console.log(paymentShare);
            console.log('test 2');
            if (memberLis.amount != undefined)
                var amountMemUpd = memberLis.amount;
            else
                amountMemUpd = 0;
            if (memberLis.username == req.session.username)
                Member.update({username: req.session.username}, {$set: {amount: amountMemUpd + updAmount}}, {new: true}, function (err, doc) {
                    console.log('parul raheja test 1');
                })
            else
                Member.update({username: memberLis.username}, {$set: {amount: amountMemUpd - paymentShare}}, {new: true}, function (err, doc) {
        
                    console.log(memberLis.username);
                })

            if (memberLis.username === req.session.username) {
                memberLis.payment.push({
                    paymentId: paymentId,
                    amountDue: +paymentShare
                })
            }
            else {
                memberLis.payment.push({
                    paymentId: paymentId,
                    amountDue: -paymentShare
                })

            }
            memberLis.save();
            console.log('checking member list 1');
            console.log(memberLis);
            console.log('checking member list 2');

            if (i == mem.length - 1)
                completeCount();
        })


    })

    function completeCount() {
        res.json({
            completed:true
        })
    }


})

app.get('/billitems/:household',paymentController.billitems);


app.post('/processLogin1',authenticationController.checkLogin);

app.post('/processLogin1', function (req, res) {
    checkLogin(req, res, req.body.uname.trim(), req.body.pword.trim())

})

app.post('/processReg1', authenticationController.processReg);






app.get('/sessioninfo', function (req, res) {
    res.send(req.session);
})


app.use(function (req, res) {
    res.status(404);
    res.render('404');
})

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
})

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
