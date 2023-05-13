var mongoose = require('mongoose');


var EventSchema = mongoose.Schema({

event_name:{
  type:String
},
location:{
type:[Number],
index:"2d"
},
start_time:{
  type:String,
},
end_time:{
  type:String,
},
Date:{
  type:Date,
},
createdDateTime:{
  type:Date,default: new Date()
}
});

module.exports = mongoose.model(' Event', EventSchema, ' Event');
