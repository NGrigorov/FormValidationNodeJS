var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var joi = require('joi');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/thelist', function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/testdb';
	
	MongoClient.connect(url,function(err,db){
		if(err)
		{
			console.log('Unable to connect to the server', err);
		}else{
			console.log("Connection Established");
			
			var collection = db.db('testdb');
			collection.collection('users').find().toArray(function(err,result){
				if(err){
					res.send(err);
				}
				else if(result.length)
				{
					res.render('userList',{
					"userList":result});
					
				}
				else
				{
					res.send('No document');
				}
				db.close();
			});
		}
	});
});

router.get('/newuser', function(req,res){
	res.render('newuser', {title: 'Add User'});
});

router.post('/adduser', function(req,res){
	var MongoClient = mongodb.MongoClient;
	
	var url = 'mongodb://localhost:27017/testdb';
	
	MongoClient.connect(url, function(err, db){
		if(err)
		{
			console.log("Unable to connect to server");
		}
		else{
			console.log('Connected to server');

			var datab = db.db('testdb');
			var collection = datab.collection('users');
			var user1 = null;
			
			var schema = joi.object().keys({
				name : joi.string().required(),
				street : joi.string().required(),
				city : joi.string().required(),
				password : joi.string().min(6).max(20).required(),
				email : joi.string().trim().email().required(),
				years : joi.string().required()
			});
			joi.validate(req.body,schema,(err,result)=>{
				if(err){
					console.log("Wrong data", err);
				}
				else{
					user1 = {name: req.body.name, 
					street: req.body.street, 
					city: req.body.city, 
					password: req.body.password, 
					email: req.body.email, 
					years: req.body.years};

					collection.insert([user1], function(err, result){
						if(err){
							console.log(err);
						}
						else{
							res.redirect("thelist");
						}
						db.close();
					});					
				}
			});
			
			
		}
	});
});

module.exports = router;
