var express = require('express');
var router = express.Router();
var mysql = require('mysql'); //(npm install - -save mysql)

// include config file. go up from routes, down into config, confi.js
var config = require('../config/config')

// include bcrypt for hashing and checking password
var bcrypt = require('bcrypt-nodejs'); //npm install --save bcrypt-nodejs

var randToken = require('rand-token'); //

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

// GET = req.query(info passed through the url)
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

// POST = req.body(info passed through the body/window)
router.post('/register', (req,res)=> {
    console.log('hello');
    const name = req.body.name;
    const email = req.body.email;
    const accountType = "customer";
    const userName = req.body.userName;
    // ########VERY IMPORTANT AND SET UP TO ENCRYPT PASSWORDS####################
    const password = bcrypt.hashSync(req.body.password);
    const city = req.body.city;
    const state = req.body.state;
    const salesRep = req.body.salesRep;
    const creditLimit = 16000000;

    var existsQuery = `SELECT * FROM users WHERE username ="${userName}"`;

    connection.query(existsQuery, (error,results)=>{
            if(error) throw error;
            if(results[0] === undefined){
                // WE want to insert the user into 2 tables: Customers and users
    // users needs the customerNumber form the Customers table. Therefore
    // we need to insert the user into customers first... get the ID created
    // by that insert, THEN insert the user into users

    // question marks after values are the inputs to corresponding positions inside the ()'s before VALUES. also they are placeholders
    // query used for realtime retail information
        var insertIntoCust = "INSERT INTO customers (customerName, city, state, salesRepEmployeeNumber, creditLimit) VALUES (?,?,?,?,?)";
        // run the query (for now autoset the sales rep to 1337)
        connection.query(insertIntoCust, [name, city, state, 1337, creditLimit], (error, results) => {
            // get tthe ID that was used in the customers insert
            const newID = results.insertId;
            // get the current time stamp
            var currTimeStamp = Date.now() / 1000;
            // set up a token for this user. we will give this back to React
            var token = randToken.uid(40);
            // users is the table, type and pw are the columns in the table. in the classicmodels DB
            // query used for authentication
            var insertQuery = "INSERT INTO users (uid, type, password, created, token, username) VALUES (?,?,?,?,?,?)";



            connection.query(insertQuery, [newID, accountType, password, currTimeStamp, token, userName], (error, results) => {
                if (error) {
                    res.json({
                        msg: error
                    })
                } else {
                    res.json({
                        msg: "userInserted",
                        token: token
                    })
                }
            })
        });
            }else{
                res.json({
                    msg: 'userAlreadyExists'
                })
            }
    });
});


module.exports = router;
