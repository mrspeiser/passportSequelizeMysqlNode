var express 	= require('express');
var app 		= express();
var passport    = require('passport');
var session     = require('express-session');
var bodyParser  = require('body-parser');
var env 		= require('dotenv').load();
var exphbs 		= require('express-handlebars');
var path		= require('path');
var mysql 	    = require('mysql2');
var http        = require('http').Server(app);
var io          = require('socket.io')(http);


//For View/Template Engine
app.set('view engine', 'ejs');
app.set('views', './app/views')
// app.engine('hbs', exphbs({
//     extname: '.hbs'
// }));


//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//For Styles
app.use(express.static(path.join(__dirname, '/app/public')));


// For Passport
app.use(session({ 
	secret: 'Awesome Sauce',
	resave: true, 
	saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



//Models
var models = require("./app/models");


//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);


//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);
 

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});


//Index Route/Routes
app.get('/', function(req, res) {
    res.render('index');
});



//Socket.io
var socket = io.of('/'); 

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

 
 

http.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});