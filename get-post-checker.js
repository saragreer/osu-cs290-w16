var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Route for GET requests
app.get('/get-post-check',function(req,res){
  var qParams = []; //create empty array to store user input
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]}); //push all input into array as object pairs
  }
  var context = {}; //create express context object to connect with templates
  context.queryData = qParams; //add user input
  context.method = req.method; //store type of request
  res.render('get-post-check', context);
});

//Route for POST requests
app.post('/get-post-check', function(req,res){
    var bParams = []; //create empty array to store body input
    var qParams = []; //create empty array to store query/URL input
  for (var q in req.query){
    qParams.push({'name':q,'value':req.query[q]}); //push input into array as object pairs
  }
  for (var p in req.body){
    bParams.push({'name':p,'value':req.body[p]}); //push input into array as object pairs
  }
  var context = {}; //express context object to connect with templates
  context.bodyData = bParams; //add body input
  context.queryData = qParams; //add query input
  context.method = req.method; //store type of request
  res.render('get-post-check', context);
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