var mongodb = require('mongodb').Db;
var mongoUri = require('../settings').mongoUri;

function User(user){
	this.name = user.name;
	this.password = user.password;
};

module.exports = User;

User.prototype.save = function save(callback){
	// save to mongodb 
	var user = {
		name: this.name,
		password: this.password,
	};
	mongodb.connect(mongoUri, function (err, db) {
		if(err){
			return callback(err);
		}
  		db.collection('users', function(err, collection) {
  			if(err){
  				db.close();
  				return callback(err);
  			}
  			collection.ensureIndex('name',{unique:true});
    		collection.insert(user,{safe:true}, function(err,user) {
    			db.close();
    			callback(err,user);
    		});
  		});
	});
};

User.get = function get(username, callback){
	mongodb.connect(mongoUri,function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}

			collection.findOne({name: username},function(err,doc){
				db.close();
				if(doc){
					var user = new User(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	});
};