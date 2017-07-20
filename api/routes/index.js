var express = require('express');
var router = express.Router();
var mysql = require('mysql');
// Include config file. Go up from routes, down into config, config.js
var config = require('../config/config');

// include bcrpyt for hasing and checking password
var bcrypt = require('bcrypt-nodejs');
// include rand-token for generating user token
var randToken = require('rand-token')

var stripe = require('stripe')(config.stripeKey);


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

router.get('/productlines/:productLines/get', (req, res)=>{
	// res.json({msg:"test"})
	const pl = req.params.productLines;
	var plQuery = `SELECT * from productlines
		INNER JOIN products ON productlines.productLine = products.productLine
		WHERE link = ?`
	connection.query(plQuery, [pl], (error, results)=>{
		if (error) throw error;
		res.json(results);
	})
});

router.post('/getCart',(req, res)=>{
	const getUidQuery = `SELECT id from users WHERE token = ?`
	connection.query(getUidQuery,[req.body.token],(error,results)=>{
		const getCartTotals = `SELECT SUM(buyPrice) as totalPrice, count(buyPrice) as totalItems FROM cart 
			INNER JOIN products ON products.productCode = cart.productCode WHERE uid=?`
		connection.query(getCartTotals,[results[0].id],(error3,results3)=>{
			if(error3){
				res.json(error3)
			}else{
				const getCartContents = `SELECT * FROM cart
				INNER JOIN products on products.productCode = cart.productCode 
				WHERE uid = ?`
				connection.query(getCartContents,[results[0].id],(error4,results4)=>{
					var finalCart = results3[0];
					finalCart.products = results4
					res.json(finalCart);
				})
			}
		})

	})
})

router.post('/updateCart', (req, res)=>{
	console.log(req.body)
	const getUidQuery = `SELECT id from users WHERE token = ?`
	connection.query(getUidQuery,[req.body.token],(error,results)=>{
		if(error) throw error;
		if(results.length == 0 ){
			res.json({msg:"badToken"})
		}else{
			const addToCartQuery = `INSERT INTO cart (uid,productCode) 
				VALUES (?,?)`;
			connection.query(addToCartQuery,[results[0].id,req.body.productCode],(error2,results2)=>{
				const getCartTotals = `SELECT SUM(buyPrice) as totalPrice, count(buyPrice) as totalItems FROM cart 
					INNER JOIN products ON products.productCode = cart.productCode WHERE uid=?`
				connection.query(getCartTotals,[results[0].id],(error3,results3)=>{
					if(error3){
						res.json(error3)
					}else{
						res.json(results3[0]);
					}
				})
			})
		}
	});

});

router.post('/register', (req, res)=>{
	console.log(req.body)

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
	});

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

router.post('/login', (req, res)=>{
	var email = req.body.email;
	var password = req.body.password;
	var checkLoginQuery = `SELECT * FROM users 
		INNER JOIN customers ON users.uid = customers.customerNumber
		WHERE email = ?`;
	connection.query(checkLoginQuery, [email], (error,results)=>{
		if(error) throw error;
		if(results.length === 0){
			// This email aint in the database
			res.json({
				msg: 'badUserName'
			});
		}else{
			// The username is valid. See if the password is...
			var checkHash = bcrypt.compareSync(password, results[0].password);
			// checkHash will be true or false.
			if(checkHash){
				// this is teh droid we're looking for
				// Log them in... i.e, create a token, update it, send it back
				const updateToken = `Update users SET token=?, token_exp=DATE_ADD(NOW(), INTERVAL 1 HOUR)
					WHERE email=?`
				var token = randToken.uid(40);
				connection.query(updateToken,[token,email],(error2,results2)=>{
					console.log(results)
					res.json({
						msg: 'loginSuccess',
						name: results[0].customerName,
						token: token
					})
				})
			}else{
				// These arent the droids were looking for.
				// You don't want to sell me death sticks.
				// You want to go home and rethink your life. Goodbye
				res.json({
					msg: 'wrongPassword'
				})
			}
		}
	})
});

router.post('/stripe', (req,res)=>{
	var userToken = req.body.userToken;
	var stripeToken = req.body.stripeToken;
	var amount = req.body.amount;
	// stripe module which is associated with our secret key
	// has a create method, which takes an object of options to charge
	stripe.charges.create({
		amount: parseInt(amount),
		currency: 'usd',
		source: stripeToken,
		description: "Charges for classicmodels",
	},(error, charge)=>{
		if(error){
			res.json({
				msg: error
			})
		}else{
			// Insert stuff from cart that was just paid into:
			// - orders
            // -  then orderdetails
			// then remove it from cart
			// have to use 'MAX' bc mysql reads identical user ids and cant decide which one to choose. applying
			// 'max' tells mysql to choose the largest. (they are all the same so it doesnt matter to us)
			const getUserQuery = `SELECT MAX(users.id) as id, MAX(users.uid) as uid,cart.productCode,products.buyPrice, COUNT(cart.productCode) as quantity FROM users 
				INNER JOIN cart ON users.id = cart.uid
				INNER JOIN products ON cart.productCode = products.productCode
			WHERE token = ? 
			GROUP BY cart.productCode`
			console.log(userToken)
			console.log(getUserQuery);
			connection.query(getUserQuery, [userToken], (error2, results2)=>{
				console.log("==========================")
				console.log(error2)
				console.log("==========================")
				const customerId = results2[0].uid;
				const insertIntoOrders = `INSERT INTO orders
					(orderDate,requiredDate,comments,status,customerNumber)
					VALUES
					(from_unixtime(`+Math.floor(Date.now()/1000)+`),from_unixtime(`+Math.floor(Date.now()/1000)+`), 'Website Order','Paid',?)`
				console.log(insertIntoOrders)
					connection.query(insertIntoOrders,[customerId],(error3,results3)=>{
						console.log(error3)
						const newOrderNumber = results3.insertId;
						// results2 (the select query above) contains an array of rows.
						// Each row has the uid, the productCOde, and the price
						// map through this array, and add each one to the orderdetails tabl

						// Set up an array to stash our promises inside of
						// After all the promises have been created, we wil run .all on this thing
						var orderDetailPromises = [];
						// Loop through all the rows in results2, which is...
						// a row for every element in the users cart.
						// Each row contains: uid, productCode,BuyPrice
						// Call the one we're on, "cartRow"
						results2.map((cartRow)=>{
							// Set up an insert query to add THIS product to the orderdetails table
							var insertOrderDetail = `INSERT INTO orderdetails
								(orderNumber,productCode,quantityOrdered,priceEach,orderLineNumber)
								VALUES
								(?,?,?,?,1)`
							// Wrap a promise around our query (because queries are async)
							// We will call resolve if it succeeds, call reject if it fails
							// Then, push the promise onto the array above
							// So that when all of them are finished, we know it's safe to move forward

							const aPromise = new Promise((resolve, reject) => {
								connection.query(insertOrderDetail,[newOrderNumber,cartRow.productCode,cartRow.quantity, cartRow.buyPrice],(error4,results4)=>{
									// another row finished.
									if (error4){
										reject(error4)
									}else{
										resolve(results4)
									}
								})
							});
							orderDetailPromises.push(aPromise);
						});
						// When ALL the promises in orderDetailPromises have called resolve...
						// the .all function will run. It has a .then that we can use
						Promise.all(orderDetailPromises).then((finalValues)=>{
							console.log("All promises finished");
							console.log(finalValues);
							const deleteQuery = `
								DELETE FROM cart WHERE uid = ${results2[0].id}
							`;
							connection.query(deleteQuery, (error5, results5)=>{
								// - orderdetails
								// Then remove it from cart
								res.json({
									msg:'paymentSuccess'
								})
							})
						});

					})
			});

		}
	})
})

module.exports = router;