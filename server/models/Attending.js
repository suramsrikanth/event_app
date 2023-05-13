var mongoose = require('mongoose');

var AttendingSchema = mongoose.Schema({

username:{
  type:String
},
event_name:{
	type:String
},
event_start:{
	type:Date
},
event_end:{
 type:Date
},
event_date:{
 type:Date
},
status:{
	type:String
},
event_id:{
   type:String
},
createdDateTime:{
	type:Date,
	default:new Date()
}
});

module.exports = mongoose.model('Attending', AttendingSchema, 'Attending');
