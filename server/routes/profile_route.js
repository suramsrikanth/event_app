const express = require('express');
const router = express.Router();
const Attending = require('../models/Attending');
const Event = require('../models/Event');
const User = require('../models/User');
var jwt = require('jsonwebtoken');



//FORMAT OF TOKEN
// Authorization : Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

//To join a event by a single user
router.post("/joinevent",verifyToken,function(req,res){

jwt.verify(req.token,'secretkey',function(err,authDate){

if(authDate){


Event.findOne({"_id":req.body.event_id} ,function(err,docs){

if(docs){

 if (typeof docs.start_time === 'string') {
      var start = new Date(docs.start_time);
    }

   if(typeof docs.end_time === 'string'){
   var end = new Date(docs.end_time);
   }

Attending.findOne({

  '$and':[
   {"event_date":{ $gte:new Date(docs.Date),$lte:new Date(docs.Date)}},{"event_start":{"$lte": end }},
   {"event_end":{"$gte": start }}, {"username":req.body.email}   ]},function(err,value){

if(value){

res.send({"message":"You already booked an event in this timing"})

}
else{

  if(typeof req.body.event_start === 'string'){
      req.body.event_start = new Date(req.body.event_start);

  }

  if(typeof req.body.event_end === 'string'){
    req.body.event_end = new Date(req.body.event_end);
  }

 var newattending = new Attending();
 newattending.username = req.body.email;
 newattending.event_name = req.body.event_name;
 newattending.event_id = req.body.event_id;
 newattending.event_date = req.body.event_date;
 newattending.event_start = req.body.event_start;
 newattending.event_end = req.body.event_end;
 newattending.status = "Going";
 newattending.save(function(err,attend){

if(err){
      throw (err);
    }
    else{
       res.send({
      "message":"You have joined event Successfully"
      });
    }
  });

}
});
}
});

}
else{
  res.sendStatus(403);
}


});

});


// It will display event for all user with location near by 30kms
router.post("/listevent",verifyToken,function(req,res){

jwt.verify(req.token,'secretkey',function(err,authDate){

if(authDate){
 var distance = 1000 / 6371;

Event.find({
'$and':[  {"Date":{$gte:new Date(req.body.date)}},
{ 'location': { "$near": [ req.body.lattitude, req.body.longitude ],"$maxDistance": distance} }

]

},function(err,docs){

res.send(docs);

});

}
else{
    res.sendStatus(403);
}

});
});


// show booked event according to the user
// router.post("/userbookevent",function(req,res){

// Attending.find({

//   '$and':[
//    {"event_date":{ $gte:new Date(req.body.event_date)  }},{"username":req.body.email} ]
//     }).sort( { event_date: -1 } ).exec(function(err,docs){
// if(!err){
//   res.send(docs);
// }

// });
// });

router.post("/userbookevent",verifyToken,function(req,res){
jwt.verify(req.token,'secretkey', function(err,authDate){

if(authDate){

Attending.find({"username":req.body.email}).sort({event_date:-1}).exec(function(err,docs){
  if(!err){
    res.send(docs)
  }
  else{
    res.send(err)
  }
});

}
else {
  res.sendStatus(403);
}
});
});



// user cancel event
router.post("/cancelevent",verifyToken,function(req,res){

jwt.verify(req.token,'secretkey',function(err,authDate){
if(authDate){

var today = new Date();

 if(typeof req.body.event_start === 'string'){
   var yesterday = new Date(req.body.event_start);
  }

var delta = Math.abs(today - yesterday) / 1000;

var hours = Math.floor(delta / 3600) % 24;
delta -= hours * 3600;

  var diffDays= hours
  console.log(diffDays);

Attending.findOne({

'$and':[  {"event_id":req.body.event_id},{ 'username': req.body.email} ] },function(err,docs){

if(docs && diffDays <= 8){
res.send({"message":"you cannot cancel event"});
}

else{
Attending.findOneAndUpdate({"event_id":req.body.event_id},{"status":"Cancel" },function(err,docs){

if(err){
  throw(err);
}
else{
  res.send({
    "message":"You cancel the event"
  })
}

});

}

});

}
else {
  res.sendStatus(403);
}

});
});


module.exports = router;