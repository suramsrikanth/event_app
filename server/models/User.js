var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({

username:{
  type:String
},
password:{
type:String
},
location:{
type:[Number],
index:"2d"
},
email:{
	type:String
},
address:{
	type:String
},
createdDateTime:{
  type:Date,
  default: new Date()
}

});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema, 'User');
