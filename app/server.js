var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var MongoObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configuring expressjs to use body-paser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var url = 'mongodb://localhost:27017/test';

var listWorkshops = function(db, callback){
	var collection = db.collection('ateliers');

	collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.dir(docs);
		callback(docs);
	});  
}

var workshopWithId = function(id, db, callback){
	var collection = db.collection('ateliers');

	try{
		var cursor = collection.find({'_id' : MongoObjectId(id)});
	
		cursor.each(function(err, doc){
			assert.equal(err, null);
			if(doc != null){
				callback(doc);
			}
		});
	}catch(exception){
		
	}
}

var updateWorkshopWithId = function(id, newValue, db, callback){
	var collection = db.collection('ateliers');
	
	collection.updateOne({'_id' : MongoObjectId(id)}, newValue, function(err, results){
		console.log(results);
		callback();
	});
}

var removeWorkshopWithId = function(id, db, callback){
	var collection = db.collection('ateliers');
	
	collection.deleteOne({'_id' : MongoObjectId(id)}, function(err, results){
		console.log(results);
		callback();
	});
}

var createNewWorkshop = function(newValue, db, callback){
	var collection = db.collection('ateliers');
	
	collection.insert(newValue, function(err, results){
		callback(results.ops[0]);
	});
}

// Routes

app.get('/workshop', function(req, res){
	MongoClient.connect(url, function(err, db) {
		listWorkshops(db, function(docs){
			res.json(docs);
		});
	});
});

app.get('/workshop/:id', function(req, res){
	MongoClient.connect(url, function(err, db) {
		workshopWithId(req.params.id, db, function(docs){
			res.json(docs);
		});
	});
});

app.put('/workshop/:id', function(req, res){
	MongoClient.connect(url, function(err, db) {
		updateWorkshopWithId(req.params.id, req.body, db, function(){
			res.send("OK");
		});
	});
});

app.delete('/workshop/:id', function(req, res){
	MongoClient.connect(url, function(err, db) {
		removeWorkshopWithId(req.params.id, db, function(){
			res.send("OK");
		});
	});
});

app.post('/workshop/', function(req, res){
	MongoClient.connect(url, function(err, db) {
		createNewWorkshop(req.body, db, function(data){
			res.send(data);
		});
	});
});


app.use(express.static('public'));

var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
});
