const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR =  "mongodb://127.0.0.1:27017/blog";

router.get('/', function(req,res,callback){
	function getData(db,callback){
		let projection = {
			title:1,
			id:1,
			addtime:1
		};
		let notes = db.collection("notes");
		notes.find({},projection).toArray(function(err,result){
			if(err){
				console.log(err);
				return;
			}
			for(let i in result){
				result[i]['addtime'] = getTime(result[i]['addtime']);
			}
			
			callback(result);
		})
	}

	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			console.log(err);
			return;
		}
		getData(db,function(result){
			console.log(result);
			db.close();
			res.render('admin/index',{
				data:result
			});

		})
		
	})
});

function getTime(time){
  time = new Date(time);
  const Mon = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
  let y = time.getFullYear();
  let m = time.getMonth();
  let d = time.getDate();
  // let H = time.getHours();
  // let M = time.getMinutes();
  // let S = time.getSeconds();

  let date = `${Mon[m]} ${d}, ${y}`;
  return date;
}

module.exports = router;


