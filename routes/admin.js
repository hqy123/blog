const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR =  "mongodb://127.0.0.1:27017/blog";

router.get('/', function(req,res,callback){
	function getData(db,callback){
		let notes = db.collection("notes");
		notes.find({}).toArray(function(err,result){
			if(err){
				console.log(err);
				return;
			}
			return result;
		})
	}

	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			console.log(err);
			return;
		}
		res.render('admin/index');
	})
});



module.exports = router;