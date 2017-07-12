var express = require('express');
var router = express.Router();
var mysql = require('mysql'); //(npm install - -save mysql)

// include config file. go up from routes, down into config, confi.js
var config = require('../config/config')


// set up the connection with options
var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

// actually make the connection
connection.connect();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/productlines/get', (req,res)=>{
    const selectQuery = "SELECT * FROM productlines"
    connection.query(selectQuery, (error, results, fields)=>{
        if(error){
            res.json(error)
        }else {
            res.json(results);
        }
    })
});


module.exports = router;
