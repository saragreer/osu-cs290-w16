var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var mysql = require('mysql');
var pool = mysql.createPool({
    host    :   'localhost',
    user    :   'student',
    password:   'default',
    database:   'student'
});

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', 3001);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'SuperSecretPassword', resave: true, saveUninitialized: false}));
app.use(express.static('public'));

app.get('/', function(req,res,next){
    var context = {};
    context.hello = "Hello world";
    res.render('home', context);
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query('INSERT INTO workouts(name,reps,weight,date,lbs) VALUES ("test",5,10,"2016-1-1",1))', function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    console.log(results);
    res.render('home',context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.post('/', function(req,res){
    //if the body reads something then call select and send back plain text
    if(req.body['something']) {
        pool.query('SELECT * FROM workouts', function(err,rows,fields){
           //handle errors
            if(err) {
                //send result back to client with message
                res.type("text/plain");
                res.send("The SQL SELECT query failed.");
            }
            
            //Send the result back to the client
            res.type("text/plain");
            res.send(rows);
        });
    }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
