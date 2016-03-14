var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'student',
    password: 'default',
    database: 'student'
});

var app = express();

app.set('port', 3001);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));

//Routes
app.get('/reset-table', function (req, res, next) {
    pool.query("DROP TABLE IF EXISTS workouts", function (err) {
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        pool.query(createString, function (err) {
            res.redirect("/");
        })
    });
});

//WORKS - Takes AJAX request from workouts.js
app.post('/insert', function (req, res, next) {
    var queryArray = [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs];
    
    //Prevents empty string from being inserted into database
    if (queryArray[0] == "") {
        console.log("Name cannot be null. Not added to database.");
        queryArray[0] == NULL;
    }
    
    pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", queryArray, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        console.log(req.body);
        res.redirect("/");
    });
});


//WORKS - Takes AJAX request from workouts.js
app.get('/view', function (req, res, next) {
    pool.query('SELECT * FROM workouts', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        console.log(rows);
        res.send(rows);
    });
});


//WORKS MANUALLY - Test using query string, couldn't get AJAX request linked
app.get('/update', function (req, res, next) {
    pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        if (result.length == 1) {
            var curVals = result[0];
            pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
                function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(result);
                    res.send("Updated " + result.changedRows + " rows.");
                });
        }
    });
});

//WORKS MANUALLY - Test using query string, couldn't get AJAX request linked
app.get('/delete', function (req, res, next) {
    pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        res.send("Deleted " + result.changedRows + " rows.");
    });
});

//Error responses
app.use(function (req, res) {
    res.status(404);
    res.send(req.statusText);
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send(req.statusText);
});

//Start server
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});