var Payment = require('../models/payment');
var Member = require('../models/member');

var paymentinformation = (req, res, next) => {
    Payment.find({}, function(err, pay) {
        res.json({
            pay
        });
    })

}

var amountDueMember = async (paymentId) => {

    return new Promise((resolve,reject) => {

        Payment.find({paymentId},(err,paymentInfo) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(paymentInfo[0].amountDue)
            }
        })

    })

}


var paymentInfoMember = async (paymentId) => {
    var paymentInfo = [];

    return new Promise((resolve,reject) => {
        Member.find({}, function(err, mem) {
            if(err) {
                console.log('checking error 1');
                reject(err);
            }
            else {
            mem.forEach(function(d) {
                d.payment.forEach(function(paymentDetails, ind) {
                    if (paymentDetails.paymentId === paymentId) {
                        var paymentFinalDetails = {
                            paymentDetails,
                            user: d.username
                        }
                        paymentInfo.push(paymentFinalDetails);

                    }
                })

            })
            resolve(paymentInfo);
        }
            
    })

    })
}

var memberinfo = async (req, res, next) => {
    var paymentInfo = [];
    var check = 'testing';
    var checking = {};
    var amountDue = {};
    var paymentInfo = [];
    var paymentId = req.params.paymentid;
    var paymentDetailsOfMember = await paymentInfoMember(paymentId);
    var amountOfMember = await amountDueMember(paymentId);
            res.json({
                paymentInfo:paymentDetailsOfMember,
                amountDue:amountOfMember
            })


}


var paymentpage = (req, res, next) => {

    var householdName = req.body.household;
    Member.find({
        $and: [{
            "username": {
                $ne: req.session.username
            }
        }, {
            "household": {
                $elemMatch: {
                    name: householdName
                }
            }
        }]
    }, function(err, mem) {
        res.json({
            member: mem,
            householdName: householdName
        });
    });

}

var transactioninfo = (req, res, next) => {
    Payment.find({}, function(err, paymentItems) {
        res.json({
            items: paymentItems
        })

    })

}

var personAmountCheck = (mem, paymentId) => {
    console.log('rus check 1');
    console.log(mem);
    console.log(paymentId);
    console.log('rus check 2');
    var personAmountDue = 0;

    for (let el of mem.payment) {
        if (el.paymentId == paymentId) {
            personAmountDue = el.amountDue;
        }
    }

    return personAmountDue;

}

var payId = (id) => {
    console.log('checking id 1');
    console.log(id);
    console.log('checking id 2');
    return 2;
}

async function memberDetails(username) {
    return new Promise((resolve,reject) => {

        Member.find({username},(err,mem) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(mem);
            }
        })



    })



}
async function paymentOfHousehold(household,paymentType) {

    return new Promise((resolve,reject) => {
     Payment.find({
            $and: [{
                paymentType
            }, {
                household
            }]
        } , (err,paymentInfo) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(paymentInfo)
            }
        })
    
    })

}


var transactionpayment = async (req, res, next) => {

    /*
    Payment.findOneAndUpdate({paymentType:req.body.paymentType},{$set:{amountDue:req.body.amount}},{new:true},function(err,doc) {
        res.send(doc);
    })
    */
    var paymentAmount = parseInt(req.body.amount);
    console.log('praheja-test');
    console.log(typeof(paymentAmount));
    console.log('payment amount check 1');
    console.log(paymentAmount);
    console.log('payment amount check 2');
    var payeeId = req.body.username;
    var paymentType = req.body.paymentType;
    var paymentId = '';
    var personAmountDue = '';
    var personNetAmount = '';
    var paymentItem = '';
    var amountMember = 0;

    var memDetails = await memberDetails(payeeId);
    var paymentHousehold = await paymentOfHousehold(req.body.household,paymentType);

            paymentItem = paymentHousehold[0];
            paymentId = paymentHousehold[0].paymentId;
            console.log('check payment id 1');
            console.log(paymentId);
            console.log('check payment id 2');

            var member = memDetails[0];
            amountMember = member.amount;
            personAmountDue = personAmountCheck(member, paymentId);
            personNetAmount = personAmountDue + paymentAmount;

            console.log('debugger test 2');
            console.log('checking net amount 1');
            console.log(personAmountDue);
            console.log('Payment Amount', paymentAmount);
            console.log(personNetAmount);
            console.log('checking net amount 2');
            if (personNetAmount > 0) {
                res.status(500).json({
                    message: 'You cannot pay more than amount due '
                })
            } else {
                console.log('debugger test 3');

                var firstQuery = Member.update({
                    username: payeeId,
                    "payment.paymentId": paymentId
                }, {
                    $set: {
                        "payment.$.amountDue": personNetAmount
                    }
                }, {
                    new: true
                }, function(err, doc) {
                    console.log(doc);
                    console.log('first update check');
                })

                var secondQuery = Member.update({
                    username: payeeId
                }, {
                    $set: {
                        amount: amountMember + paymentAmount
                    }
                }, {
                    new: true
                }, function(err, doc) {
                    console.log(doc);
                    console.log('second update check');
                })
                var thirdQuery = Payment.find({
                    paymentId: paymentId
                });

                Promise.all([firstQuery, secondQuery, thirdQuery]).then(async (reso) => {

                    var lender = '';
                    var paymentLender = 0;
                    var mem = reso[2];
                    var paymentLender = await lenderMember(mem[0].lender);
                    //}).then((r) => {
                    console.log('checking lender payment 1');
                    console.log(paymentLender);
                    console.log('checking payment lender 2');   
                    var updAmountForMember = await updMemAmount(mem[0].lender,paymentAmount,paymentLender);
                    var  updAmountDue = paymentItem.amountDue - paymentAmount;
                    console.log('some checks here 1');
                    console.log(updAmountDue);
                    console.log('some check here 2');
                    var updPaymentOfHousehold = await updPaymentAndHousehold(paymentType,req.body.household,updAmountDue);
                    console.log(updPaymentOfHousehold);
                     res.json(updPaymentOfHousehold);
                            
                })

            }

        


}



async function lenderMember(lender) {

    return new Promise((resolve,reject) => {
        Member.find({username:lender},(err,mem) => {
            if(err) {
                reject(mem);
            }
            else {
                resolve(mem[0].amount);

            }

        })
    })

}

async function updMemAmount(lender,paymentAmount,paymentLender) {
    return new Promise((resolve,reject) => {
        Member.update({
                    username: lender
                      }, {
                    $set: {
                        amount: paymentLender - paymentAmount
                    }}, 
                    {
                    new: true
                    }, (err,doc) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(doc);
                    }
                })
                

    })

}

async function updPaymentAndHousehold(paymentType,household,updAmountDue) {
    return new Promise((resolve,reject) => {
        Payment.update({
                        $and: [{paymentType: paymentType}, {household}]}, {
                        $set: {
                                amountDue: updAmountDue
                            }
                        }, 
                        {
                            new: true
                        }, (err, updPayment) => {
                            if (err) {
                                reject({
                                    message: 'Payment Was unsuccessfull'
                                })
                            } else {
                                console.log(updPayment);
                                resolve({message: 'Payment Was successfull'});
                            }

    })
    })
}


var makepayment = (req, res, next) => {
    var amount = req.body.amount;
    var type = req.body.type;
    var paymentId = req.body.paymentId;
    var household = req.body.household;
    var date = req.body.date;
    var personList = req.body.person;
    var personSel = [];
    personSel.push({
        username: req.session.username
    });
    if (typeof personList === "string") {
        personSel.push({
            username: personList
        });
    } else {
        personList.forEach(function(d) {
            var personCreate = {
                username: d
            };
            personSel.push(personCreate);
        })

    }

    Member.find({
        $or: personSel
    }, function(err, mem) {
        var getMembersLength = personSel.length
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

        mem.forEach(function(memberLis, i) {
            if (memberLis.amount != undefined)
                var amountMemUpd = memberLis.amount;
            else
                amountMemUpd = 0;
            if (memberLis.username == req.session.username)
                Member.update({
                    username: req.session.username
                }, {
                    $set: {
                        amount: amountMemUpd + updAmount
                    }
                }, {
                    new: true
                }, function(err, doc) {
                    console.log('parul raheja test 1');
                })
            else
                Member.update({
                    username: memberLis.username
                }, {
                    $set: {
                        amount: amountMemUpd - paymentShare
                    }
                }, {
                    new: true
                }, function(err, doc) {

                    console.log(memberLis.username);
                })

            if (memberLis.username === req.session.username) {
                memberLis.payment.push({
                    paymentId: paymentId,
                    amountDue: +paymentShare
                })
            } else {
                memberLis.payment.push({
                    paymentId: paymentId,
                    amountDue: -paymentShare
                })

            }
            memberLis.save();

            if (i == mem.length - 1)
                completeCount(req, res, next);
        })


    })
}

completeCount = (req, res, next) => {
    res.json({
        completed: true
    })
}

var billitems = (req, res, next) => {

    var household = req.params.household;
    Payment.find({
        household: household
    }, function(err, paymentItems) {
        //res.render('transaction', {items: paymentItems, username: req.session.username, household: household})
        res.json({
            items: paymentItems,
            username: req.session.username,
            household: household
        })
    })

}

module.exports = {
    billitems,
    completeCount,
    makepayment,
    transactionpayment,
    transactioninfo,
    paymentpage,
    memberinfo,
    paymentinformation,
    personAmountCheck


}