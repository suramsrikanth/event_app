const express = require('express');
const router = express.Router();
const Attending = require('../models/Attending');
const Event = require('../models/Event');
const User = require('../models/User');
var jwt = require('jsonwebtoken');


router.post("/addevent",function(req,res){

  var newevent = new Event();
 
 newevent.event_name = req.body.event_name;
 newevent.location = [req.body.lattitude,req.body.longitude];
 newevent.start_time = req.body.start_time;
 newevent.end_time = req.body.end_time;
 newevent.Date = new Date(req.body.Date);

 newevent.save(function(err,docs){
  if(err){
    res.json(err)
  }
  else{
    res.send({
      "message":"Event  is created Successfully"
      });
  }
 })

}); 


//signup
router.post("/signup",function(req,res){

User.findOne({"email":req.body.email},function(err,docs){

  //if(err) throw (err);

  if(!docs){

 var newuser = new User();
 var newattending = new Attending();
 newuser.username = req.body.username;
 newuser.password = newuser.generateHash(req.body.password)
 newuser.location = [req.body.lattitude,req.body.longitude];
 newuser.email = req.body.email;
 newuser.address = req.body.address;

 newuser.save(function(err,user){
  if(err){
    throw (err);
  }
  else{
  res.send({
      "message":"User  is created Successfully"
      });
  }
 });
 }
 else{
  res.send({"message":"Email is already exist"});
 }
})

});



// login where the jwt token will be created  we can also expries it{ expiresIn: '30s' }
router.post('/login',function(req,res){
var password = req.body.password;

User.findOne({email:req.body.email},function(err,user){
if(err){
    res.json(err);
}
else if(!user){
	res.json({
		status:0,
		message: 'sorry user not exist'
	});
}
else if(!user.validPassword(password)){

	res.json({
       status: 0,
       message: 'Sorry wrong  password'
     });
}

 if(user){

  jwt.sign({user},'secretkey',function(err,token){ 
  res.json({ "message":"login success", "token":token });
});

}
});
});


// It will display the person who are all attending the event
router.get("/eventparticipate/:event_id",function(req,res){

Attending.find({

  '$and':[
   {"event_id":req.params.event_id},
   {"event_date":{ $gte:new Date(req.body.event_date),$lte:new Date(req.body.event_date)}}
   ]},{"username":true,"status":true},function(err,docs){

res.send({"participants":docs});
   });

});





module.exports = router;