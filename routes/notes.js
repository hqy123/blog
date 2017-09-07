var express = require('express');
var async   = require('async');
var router  = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/blog';

router.get('/',function(req, res) {
	if(!req.session.username) {
		res.redirect('/users/login');
	}
	res.render('./notes/index')
})

router.get('/page', function(req,res){
	var note_id = parseInt(req.query.id);
	function getOnePage(db, callback){
		var collection = db.collection('notes');
		collection.find({id: note_id}).toArray(function(err, result){
			if(err){
				console.log(err);
				return;
			}
			callback(result);
		})

	}
	MongoClient.connect(DB_CONN_STR,function(err,db){
		getOnePage(db,function(result){
			db.close()
			res.render('./notes/page',{data:result});
		})
	})
	
})
//notes上传接口
router.post('/save',function(req, res) {
	var data = {
		title: req.body.title,
		content: req.body.content
	};
	var note_id;
	MongoClient.connect(DB_CONN_STR, function(err, db){
		console.log('db connect success!!!!');
		var noteId = db.collection('noteId');
		var notes  = db.collection('notes');

		async.waterfall([
			function (callback){
				noteId.find().toArray(function(err, result){
					if(err){
						console.log(err);
						return;
					}
					var note_id = result1[0].id;
					callback(null, note_id);
				 })
				
			},
			function(note_id, callback){
				data.id = note_id;
				notes.save(data,function(err,result){
					if(err){
						console.log(err);
						return;
					}
				})
				callback(null);
			},
			function (callback){
				noteId.update({},{$inc:{id:1}},function(err,result){
					if(err){
						console.log(err);
						return;
					}
				})
				callback(null);
			}],function(err, result){
				db.close();
				res.redirect('/notes'); 
		})
	})
})

module.exports = router;