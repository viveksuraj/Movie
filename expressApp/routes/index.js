var express = require('express');
var fs=require('fs');
var bodyParser = require('body-parser');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Reading the JSON File
router.get('/getJSON',function(req,res)
{
  console.log("inside get json");
  var readjson=fs.readFileSync('data/movie.json');
  res.json(readjson.toString());
});

router.get('/updateMovie', function(req, res) {
		console.log("Into Update");
		var requestedPath = req.url;
		var title = req.body.myTitle;
		var year = req.body.Year;
		var director = req.body.Director;
		var actors = req.body.Actor;
		var plot = req.body.Plot;
		var movieID = req.body.ID;
		var jsonFile = fs.readFileSync('data/movie.json');
		var json = JSON.parse(jsonFile);
		for (var i = 0; i < json.length; i++) {
			if (json[i].title == title) {
				json[i].director = director;
				json[i].year = year;
				json[i].actors = actors;
				json[i].plot = plot;
			}
		}
		var fullJSON = JSON.stringify(json);
		fs.writeFileSync('data/movie.json', fullJSON);
    res.render('index');
	});



  router.delete('/deleteMovie', function (req, res) {
  //console.log("Got a DELETE request");
  requestedPath=req.url;
  console.log(requestedPath);
 if(requestedPath.indexOf("titlename") !=-1){
   var movieID =  requestedPath.substring(requestedPath.indexOf("titlename")+10).trim();
   console.log(movieID);
  var jsonFile = fs.readFileSync('data/movie.json');
  var json = JSON.parse(jsonFile);
  for(var i=0;i<json.length;i++)
  {
    if(json[i].title==movieID)
    {
      console.log(json[i]);
      json.splice(i,1);
          var x=JSON.stringify(json);
      fs.writeFileSync('data/movie.json',x);
    }
  }
}
});
  router.get('/addMovie',function(req,res){
requestedPath=req.url;
//console.log("INSIDE ADD movie");
if(requestedPath.indexOf("movieName") != -1){
  var title =  requestedPath.substring(requestedPath.indexOf("movieName")+10).trim();
  console.log(title);
  omdb({t:title}).list(function(err,data){
    console.log("hi");
    if(err){
      return console.error(err);
    }
    if(data.length<1)
    {
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end(data,'utf-8');
      res.end();
      console.log("cannot find movie");
    }
    else {
      console.log("in");
      var jsonFile=fs.readFileSync('data/movie.json');
      console.log(jsonFile.toString());
      var myjson=JSON.parse(jsonFile);
      myjson.push(data);
      var addedJson=JSON.stringify(myjson);
      fs.writeFileSync('data/movie.json',addedJson);
    }
  });
}
});
module.exports = router;