
var express = require('express'),
handlebars = require('express-handlebars').create({defaultLayout: 'main'});
require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect('mongodb://praheja:boldtest12345@ds145926.mlab.com:45926/household-project');
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





var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'parultestcheck1@gmail.com',
    pass: ''
}
});

var mailOptions = {
from: 'parultestcheck1@gmail.com',
to: 'parulraheja98@gmail.com',
subject: 'Sending Email using Node.js',
text: 'That was easy!'
};


app.get('/testingraheja', (req,res) => {
console.log(process.env.PASSWORD);
res.send('completed');

});


app.get('/paymentinformation',paymentController.paymentinformation);

app.get('/memberinformation/:paymentid',paymentController.memberinfo);



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


app.get('/billitems/:household',paymentController.billitems);


app.post('/processLogin1',authenticationController.processLogin);


app.post('/processReg1', authenticationController.processReg);


app.get('/sessioninfo', function (req, res) {
res.send(req.session);
})



app.get('/testinghere', (req,res) => {
res.send('completed');
})



app.listen(app.get('port'), function () {
console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});

module.exports = app;
