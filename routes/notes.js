const express = require('express');
const async   = require('async');
const router  = express.Router();

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://127.0.0.1:27017/blog';

router.get('/',function(req, res) {
	if(!req.session.username) {
		res.redirect('/users/login');
	}
	res.render('./notes/index')
})

router.get('/page', function(req,res){
	let note_id = parseInt(req.query.id);
	function getOnePage(db, callback){
		let collection = db.collection('notes');
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
			res.render('./notes/page',{
				data:result,
				username:req.session.username
			});
		})
	})
	
})
//notes上传接口
router.post('/save',function(req, res) {
	let data = {
		title: req.body.title,
		content: req.body.content,
		addtime: new Date().getTime()
	};
	MongoClient.connect(DB_CONN_STR, function(err, db){
		let noteId = db.collection('ids');
		let notes  = db.collection('notes');

		let options = [{name:"note"},{_id:1},{$inc:{id:1}},{new:true}];
		async.waterfall([
			function (callback){
				noteId.findAndModify(...options)
					.then(result=>{
						callback(null, result.value.id)
					},err=>{
						console.log(err);
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
			}],function(err, result){
				db.close();
				res.redirect('/notes'); 
		})
	})
})

module.exports = router;