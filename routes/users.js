var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/blog';

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
router.post('/signUp', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	function insertData(db, callback){
		var collection = db.collection('users');
		var data = {
			username: username, 
			password: password
		}
		collection.insert(data, function(err,result){
			if(err){
				console.log(err);
				return;
			}
			callback(result);
		})
	}

	MongoClient.connect(DB_CONN_STR, function(err, db){
		console.log('connect success!!!!');
		insertData(db, function(result){
			req.session.username = result.ops[0].username;
			res.redirect('/');
			db.close();	
		})

	})
})

//登录接口
router.post('/signIn', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	function findUser(db, callback){
		 var collection = db.collection('users');
		 var data = {
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
