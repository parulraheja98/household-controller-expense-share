var Payment = require('../models/payment');
var Member = require('../models/member');

var paymentinformation = (req,res,next) => {
    Payment.find({}, function (err, pay) {
        res.json( {pay});
    })

}

var memberinfo = (req,res,next) => {
    var paymentInfo = [];
    var check = 'testing';
    var checking = {};
    var amountDue = {};
    var paymentInfo = [];
    var paymentId = req.params.paymentid;

    Member.find({}, function (err, mem) {
        mem.forEach(function (d) {
            d.payment.forEach(function (paymentDetails,ind) {
                if (paymentDetails.paymentId === paymentId) {
                    var paymentFinalDetails = {
                        paymentDetails,
                        user:d.username
                    }
                    paymentInfo.push(paymentFinalDetails);

                }
            })

        })

    
    }).then(function(r) {

        var paymentId = req.params.paymentid;  
       return Payment.find({paymentId:paymentId});

    })
    .then(function(r) {
       res.json({
           paymentInfo,
           amountDue:r[0].amountDue
       })

        })
    
}

var paymentpage = (req,res,next) => {

    var householdName = req.body.household;
    Member.find({$and: [{"username": {$ne: req.session.username}}, {"household": {$elemMatch: {name: householdName}}}]}, function (err, mem) {
        res.json( {member: mem, householdName: householdName});
    });

}

var transactioninfo = (req,res,next) => {
    Payment.find({}, function (err, paymentItems) {
        res.json({
            items:paymentItems
        })
       
    })

}

var transactionpayment = (req,res,next) => {

    /*
    Payment.findOneAndUpdate({paymentType:req.body.paymentType},{$set:{amountDue:req.body.amount}},{new:true},function(err,doc) {
        res.send(doc);
    })
    */
   var paymentAmount = parseInt(req.body.amount);
   console.log('praheja-test');
   console.log(typeof(paymentAmount));
   var payeeId = req.body.username;
   var paymentType = req.body.paymentType;
   var paymentId = '';
   var personAmountDue = '';
   var personNetAmount = '';
   var paymentItem = '';
   var amountMember = 0;
   Payment.find({$and: [{paymentType: paymentType}, {household: req.body.household}]}, function (err, paymentItemInd) {
       paymentItem = paymentItemInd[0];
       paymentId = paymentItem.paymentId;
   })

   Member.find({username: payeeId}, function (err, mem) {
       var member = mem[0];
       amountMember = mem[0].amount;
       member.payment.forEach(function (d) {
           if (d.paymentId == paymentId) {
               personAmountDue = d.amountDue;
           }
       })
       personNetAmount = personAmountDue + paymentAmount;

   }).then(function (r, err) {
       if (personNetAmount > 0) {
           res.status(500).json({
               message:'You cannot pay more than amount due '
           })
       }

       else {

       Member.update({
           username: payeeId,
           "payment.paymentId": paymentId
       }, {$set: {"payment.$.amountDue": personNetAmount}}, {new: true}, function (err, doc) {
           console.log(doc);
       })

       Member.update({username: payeeId}, {$set: {amount: amountMember + paymentAmount}}, {new: true}, function (err, doc) {
           console.log(doc);
       })

       var lender = '';
       var paymentLender = 0;
       Payment.find({paymentId: paymentId}, function (err, re) {

           lender = re[0].lender;
           Member.find({username: lender}, function (err, memLender) {
               paymentLender = memLender[0].amount;
               Member.update({username: lender}, {$set: {amount: paymentLender - paymentAmount}}, {new: true}, function (err, doc) {
                   console.log(doc);
               })

           }).then(function (r) {

               updAmountDue = paymentItem.amountDue - paymentAmount;
               Payment.update({$and: [{paymentType: paymentType}, {household: req.body.household}]}, {$set: {amountDue: updAmountDue}}, {new: true}, function (err, updPayment) {
                  if(err) {
                      res.status(500).json({
                          message:'Payment Was unsuccessfull'
                      })
                   }
                   else {
                       res.status(200).json({
                           message:'Payment successfully made '
                       })
                       
                   
                  }

               })

           })
       

       })
   }

   }).catch(function (e) {
       res.json({
           error:'You cannot pay more than amount that is due '
       })
   })

}

var makepayment = (req,res,next) => {
    var amount = req.body.amount;
    var type = req.body.type;
    var paymentId = req.body.paymentId;
    var household = req.body.household;
    var date = req.body.date;
    var personList = req.body.person;
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

    Member.find({$or: personSel}, function (err, mem) {
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

        mem.forEach(function (memberLis, i) {
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

            if (i == mem.length - 1)
                completeCount();
        })


    })
}

completeCount = (req,res,next) => {
    res.json({
        completed:true
    })
}

var billitems = (req,res,next) => {

    var household = req.params.household;
    Payment.find({household: household}, function (err, paymentItems) {
        //res.render('transaction', {items: paymentItems, username: req.session.username, household: household})
        res.json({
            items:paymentItems,
            username:req.session.username,
            household:household
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
    paymentinformation


}