const express = require('express');
const router  = express.Router();
const async   = require('async');

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://127.0.0.1:27017/blog';
/* GET home page. */
router.get('/', function(req, res, next) {
  
  function getData(db, callback){
    let notes = db.collection('notes');
    let page  = req.query.page || 1;
    let pageSize   = 7;
    let totalPage = 0;


    async.waterfall([
        function(callback){
          notes.count({},function(err, result){
            totalPage = Math.ceil(result/pageSize);
            if(page<1) page = 1;
            else if(page>totalPage) page = totalPage;
            callback(null, page);
          })      
        },
        function(page, callback){
            notes.find({}).skip((page-1)*pageSize).limit(pageSize).toArray(function(err, result){
              if(err){
                console.log(err);  return;
              }
              for(item in result) {
                result[item].content = result[item].content.replace(/<[^>]+>/g,'').substring(0,200)+'[...]';
                if(!result[item].addtime){
                  result[item].addtime = getTime(0);
                } else{
                  result[item].addtime = getTime(result[item].addtime);
                }
              }
              callback(null, result);
            })
        }
      ],function(err, result){
          if(err) console.log(err);       
          callback(result, totalPage, page);
    })
    
    

  }
  MongoClient.connect(DB_CONN_STR, function(err,db){
  	getData(db, function(result, totalPage, page){    
  		db.close();

      res.render('index', { 
        title: 'Express' ,
        username: req.session.username,
        data: result,
        page: page,
        totalPage: totalPage
      })
  	})
  })

  
});

module.exports = router;

function getTime(time){
  time = new Date(time);
  const Mon=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
  let y = time.getFullYear();
  let m = time.getMonth();
  let d = time.getDate();
  // let H = time.getHours();
  // let M = time.getMinutes();
  // let S = time.getSeconds();

  let date = `${Mon[m]} ${d}, ${y}`;
  return date;
}