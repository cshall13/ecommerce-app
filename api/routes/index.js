var express = require('express');
var router = express.Router();
var mysql = require('mysql');
// Include config file. Go up from routes, down into config, config.js
var config = require('../config/config');

// include bcrpyt for hasing and checking password
var bcrypt = require('bcrypt-nodejs');
// include rand-token for generating user token
var randToken = require('rand-token')

// set up the connection with options
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});
// Actually make the connection
connection.connect();

// router.get('/:something/:something2',(req,res, next)=>{
// 	req.cookies.url = req.body.param.something
// 	next()
// })

router.get('/productlines/get', (req, res)=>{
	const selectQuery = "SELECT * FROM productlines"
	connection.query(selectQuery,(error, results, fields)=>{
		if(error){
			res.json(error)
		}else{
			res.json(results);
		}
	});
});

router.get('/productlines/:productLines/get',(req,res)=>{
	// res.json({msg:"test"})
	const pl = req.params.productLines;
	// 'productlines' is the table 'productLines is the field'
	var plQuery = `SELECT  * FROM productlines
	INNER JOIN products ON productlines.productLine = products.productLine
	WHERE link = ?`; //'?' is the same as %s in python, placeholder for var
    connection.query(plQuery, [pl], (error, results)=>{
        if(error) throw error;
        res.json(results);
    })
});

router.post('/updateCart', (req, res)=>{
	console.log(req.body);
	const getUidQuery = `SELECT id from users WHERE token = ?`;
	connection.query(getUidQuery, [req.body.token],(error,results)=>{
		if(error) throw error;
		if(results.length === 0){
			res.json({
				msg: "badToken"
			})
		}else{
			const addToCartQuery = `INSERT INTO cart (uid, productCode) VALUES (?,?)`;
			connection.query(addToCartQuery, [results[0].id,req.body.productCode],(error, results)=>{
				const getCartTotals = `SELECT SUM(buyPrice) as totalPrice, COUNT(buyPrice) as totalItems FROM cart 
  				INNER JOIN products ON products.productCode = cart.productCode WHERE uid = ?`;
			connection.query(getCartTotals,[results[0].id],(results3, error3)=>{
				res.json(results3)
			});
				res.json({productNumber: req.body.productCode})
			})
		}
	});

});

router.post('/register', (req, res)=>{
	console.log(req.body);

	const name = req.body.name;
	const email = req.body.email;
	const accountType = 'customer';
	const password = bcrypt.hashSync(req.body.password);
	const city = req.body.city;
	const state = req.body.state;
	const salesRep = req.body.salesRep
	const creditLimit = 16000000

	// We want to insert the user into 2 tables: Customers and Users.
	// Users needs the customerNumber from the Customers table.
	// Therefore, we need to insert the user into Customers first...
	// get the ID created by that insert, THEN insert the user into Users.

// First, check to see if email already exists
	const checkEmail = new Promise((resolve, reject) => {
		const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
		connection.query(checkEmailQuery,[email],(error,results)=>{
			if(error) throw error;
			if(results.length > 0){
				reject({msg: "userAlreadyExists"});
			}else{
				// we dont care about results. Just that there isn't a match
				resolve();
			}
		})
	})

	checkEmail.then(
		// Customers insert query
		()=>{
			var insertIntoCust = "INSERT INTO customers (customerName, city, state, salesRepEmployeeNumber, creditLimit) VALUES (?,?,?,?,?)"
			// Run the query (for now autoset the sales rep to 1337)
			connection.query(insertIntoCust,[name,city,state,1337,creditLimit],(error, results)=>{
				// Get the ID that was used in the customers insert
				const newID = results.insertId
				// Get the current timestamp
				var currTimeStamp = parseInt(Date.now() / 1000);
				// Set up a token for this user. We will give this back to React
				var token = randToken.uid(40);
				// Users insert query
				var insertQuery = "INSERT INTO users (uid,type,password,created,token,email) VALUES (?,?,?,?,?,?)";
				// Run the query. Use error2 and results2 because are already used results and error

				connection.query(insertQuery,[newID, accountType,password, currTimeStamp, token, email],(error2,results2)=>{
					if(error2){
						res.json({
							msg: error2
						})
					}else{
						res.json({
							msg: "userInserted",
							token: token,
							name: name
						});
					}
				});
			})
		}
	).catch(
		(error)=>{
			res.json(error)
		}
	)

});

router.post('/login', (req,res)=> {
    var email = req.body.email;
    var password = req.body.password;
    var checkLoginQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(checkLoginQuery, [email], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            // this email isnt in the database
            res.json({
                msg: 'badUserName'
            })
        } else {
            // the username is valid. see if the pw is
            var checkHash = bcrypt.compareSync(password, results[0].password);
            // checkHash will be true or false
            if (checkHash) {
                // this is the droid we're looking for
                // log them in IE create a token, update it, send it back(to react as JSON)
                const updateToken = `UPDATE users SET token=?, token_exp=DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email=?`;
                var token = randToken.uid(40);
                connection.query(updateToken, [token, email], (error2, results2) => {
                    res.json({
                        msg: 'loginSuccess',
                        name: results[0].name,
                        token: token
                    })
                })
            } else {
                // these arent the droids you are looking for.
                //     you dont want to sell me death sticks
                //     you want to go home and rethink your life
                res.json({
                    msg: 'wrongPassword'
                })
            }
        }
    })
});

module.exports = router;










