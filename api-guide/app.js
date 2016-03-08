var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');
var credentials = require('./credentials.js');

var app = express();

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', 8888);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req,res,next){
    res.render('home');
});

app.get('/start', function(req,res,next){
    res.render('start');
});

app.get('/apis', function(req,res,next){
    res.render('apis');
});

app.get('/errors', function(req,res,next){
    res.render('errors');
});

app.get('/data', function(req,res,next){
    res.render('data');
});

app.get('/credits', function(req,res,next){
    res.render('credits');
});

app.get('/testapi', function(req,res,next){
    //example parameters, empty context object
    var query = "javascript",
        location = "austin, tx",
        context = {};
    //make request to api using above variables
    request("http://api.indeed.com/ads/apisearch?publisher=" + credentials.publisherID + "&q=" + query + "&l=" + location + "&v=2&format=json", function(err, response, body){
        //put returned data into context object
        context = JSON.parse(body);
        context.snippetLength = context.results[2].snippet.length;
        context.exampleSnippet = context.results[0].snippet;
        context.totalPages = Math.ceil(context.totalResults/(context.end - context.start + 1));
        context.exampleUrl = context.results[0].url;
        console.log(context);
        res.render('testapi', context);
    });
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