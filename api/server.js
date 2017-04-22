// server.js
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const logger = require("morgan");
const express = require('express');
const session = require('express-session');
const app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// morgan logger
app.use(logger('dev', {
    stream: fs.createWriteStream('./access.log', {
        flags: 'a'
    })
}));

// TODO: move secret to redis or ENV variable
// express session
app.use(session({
		secret:"jask23jadfksf2f3rjoj",
		resave : false,
		saveUninitialized:true}
));

// connect to mongodb
var db = fs.readFileSync('./config/database.conf').toString().split('\n')[0];
mongoose.connect(db, function(err) {
  if (err) {
    console.error("MongoDB connection error!!", err);
    process.exit(1);
  }
  console.log("MongoDB server connected (%s)..",db);
});


// route middleware
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
  console.log(new Date(),req.method, req.url, req.body);
  console.log("    RESPONSE ",res.statusCode);
});

// API handlers
var UserHandler = require('./routes/UserHandler.js');
var ProjectHandler = require('./routes/ProjectHandler.js');
let EntryHandler = require('./routes/EntryHandler.js');
let TaskHandler = require('./routes/TaskHandler.js');
var handlers = {
  user: new UserHandler(),
  project: new ProjectHandler(),
  entry: new EntryHandler(),
  task: new TaskHandler()
};

// routes setup
var routes = require('./routes/routes');
routes.setup(app, handlers);

app.listen(3000, function () {
  console.log('listening on port 3000....');
});
