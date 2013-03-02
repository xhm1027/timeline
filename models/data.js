var mongodb = require('mongodb').Db;
var mongoUri = require('../settings').mongoUri;
var Asset = require('./asset');

function Data(data){
	this.username = data.username;
	this.startDate = data.startDate;
	this.endDate = data.endDate;
	this.headline = data.headline;
	this.text = data.text;
	// this.asset = data.asset;
	this.asset = new Asset(data.asset);
};

// function Asset(asset){
// 	this.media = asset.media;
// 	this.credit = asset.credit;
// 	this.caption = asset.caption;
// }

module.exports = Data;

Data.prototype.save = function save(callback){
	// save to mongodb 
	var data = {
		username:this.username,
		startDate: this.startDate,
		endDate: this.endDate,
		headline: this.headline,
		text: this.text,
		asset: {
			media:this.asset.media,
			credit:this.asset.credit,
			caption:this.asset.caption
		}
	};
	mongodb.connect(mongoUri, function (err, db) {
		if(err){
			return callback(err);
		}
  		db.collection('datas', function(err, collection) {
  			if(err){
  				db.close();
  				return callback(err);
  			}

    		collection.insert(data,{safe:true}, function(err,data) {
    			db.close();
    			callback(err,data);
    		});
		});
	});
};

Data.get = function get(username, callback){
	mongodb.connect(mongoUri,function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('datas',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}

			collection.find({username: username}).toArray(function(err,docs){
				db.close();
				var datas =[];
				docs.forEach(function(doc,index){
					var data = new Data(doc);
					datas.push(data);
				});
				callback(null,datas);
			});
		});
	});
};