const express = require('express');
const async = require('async');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://127.0.0.1:27017/blog';

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(!req.session.username){
    	res.redirect('/users/login');
    }else{
    	res.send('ok');
    }
});

router.get('/login', function(req, res){
	res.render('./user/login')
})
router.get('/register', function(req,res){
	res.render('./user/register')
})

//注册接口
router.post('/signUp', function(req, res) {
	let userData = {
		username: req.body.username,
		password: req.body.password
	};

	MongoClient.connect(DB_CONN_STR, function(err, db) {
		let user = db.collection('users');
		let userId = db.collection('ids');

		let options = [{name:'user'},{_id:1},{$inc:{id:1}},{new:true}];
		async.waterfall([
			function(callback){
				//查询用户名有没有被注册过
				let where = {"username": userData.username};
				user.find(where).toArray(function(err,result){
					if(err) {
						console.log(err);
						return;
					}
					if(result.length > 0) {
						res.send("用户名已存在"); 
						db.close();
					}
				})
				//查询用户id
				userId.findAndModify(...options).
				then((result)=>{
					callback(null,result.value.id)
				},(err)=>{
					console.log(err)
				})

			},

			function(id,callback){
				userData.id = id;
				user.insert(userData, function(err,result){
					if(err) {
						console.log(err);
						return;
					}
					callback(null,result);
				})
			}
			],function(err,result){
				if(err){
					console.log(err);
					return;
				}
				db.close();
				req.session.username = result.ops[0].username;
				res.redirect('/')
		})
	})
})

//登录接口
router.post('/signIn', function(req, res){
	let username = req.body.username;
	let password = req.body.password;

	function findUser(db, callback){
		 let collection = db.collection('users');
		 let data = {
			username: username, 
			password: password
	     };

	     collection.find(data).toArray(function(err, result){
	     	if(err){
	     		console.log(err);
	     		return;
	     	}
	     	callback(result);
	     })

	}

	MongoClient.connect(DB_CONN_STR, function(err, db){
		findUser(db, function(result){
			req.session.username = result[0].username;
			res.redirect('/')
		})
	})
})

//注销session
router.get('/signOut', function(req, res){
	req.session.destroy(function(err){
		if(err){
			console.log(err)
			return;
		}
		res.redirect('/')
	});
})
module.exports = router;
