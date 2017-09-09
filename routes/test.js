var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	res.send("this is a test")
});


router.get('/ab*aa', function(req,res,next){
	console.log("wait");
	next();
}, function(req,res){
	res.send("ok")
});
module.exports = router;