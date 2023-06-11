const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server=require('http').Server(app);


//Models
// var Admin = require('./server/models/Admin.js');
// var Post = require('./server/models/Post.js');
// var Feed = require('./server/models/Feed.js');

//Routes
var User_route = require('./server/routes/user_route');
var Profile_route = require('./server/routes/profile_route');


//Database
mongoose.Promise = require('bluebird');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://test:5w1dlkPM7fUg9L5b@cluster0.eefkrs6.mongodb.net/water?retryWrites=true&w=majority', { useNewUrlParser: true });
var db = mongoose.connection;

db.on('open', function() {
    console.log('App is connected to database: Now connected');
});

db.on('error', function(err) {
    console.log(err);
});


app.use(bodyParser.json());



app.use('/user', User_route);
app.use('/profile',Profile_route);


server.listen(9000, function(req, res) {
    console.log('Server is running on port 9000...');
});

// Allow user to join any event. But can not participate in events with overlapping timings
