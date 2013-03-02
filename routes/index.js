
/*
 * GET home page.
 */

var User = require('../models/user.js');

var Data = require('../models/data.js');

module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index', { 
			title: 'timeline',
			layout: 'layout_timeline'
		});
	});

	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg', { title: 'timeline register' });
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		//check password
		if(req.body['password-repeat'] != req.body['password']){
			//req.session.messages = 'password not same';
			console.log('password not same');
			// req.flash('password not same');
			req.session.error = 'password not same';
			return res.redirect('/reg');
		}
		var newUser = new User({
			name: req.body.username,
			password:req.body.password,
		});
		//check user exist or not
		User.get(newUser.name,function(err,user){
			//user exist
			if(user){
				err = 'user already exist';
			}
			if(err){
				//	req.session.messages = err;
				req.session.error = err;
				console.log(err);
				return res.redirect('/reg');
			}
			newUser.save(function(err){
				if(err){
					console.log(err);
					req.session.error = err;
					return res.redirect('/reg');
				}
				// req.session.user = newUser;
				req.session.success ='reg success';
				console.log('reg success');

				//req.session.messages ='reg success';
				res.redirect('/login');
			});
		});
	});
	
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{title: 'timeline login'});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		//check user exist or not
		User.get(req.body.username,function(err,user){
			//user not exist
			if(!user){
				err = 'user not exist';
			}else if(req.body.password!=user.password){
				err = 'password error';
			}
			if(err){
				req.session.error = err;
				console.log(err);
				return res.redirect('/login');
			}
			req.session.user = user;
			// req.session.success ='login success';
			console.log('login success');
			res.redirect('/list');
			
		});
	});

	app.get('/logout',checkLogin);
	app.get('/logout', function(req,res){
		req.session.user = null;
		req.session.success ='logout success';
		res.redirect('/login');
	});

	app.get('/data',checkLogin);
	app.get('/data',function(req,res){
		res.render('data',{title:'data push'});
	});

	app.post('/data',checkLogin);
	app.post('/data',function(req,res){
		// console.log(req.session.user);
		var newData = new Data({
			username:req.session.user.name,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			headline: req.body.headline,
			text: req.body.text,
			asset: {
				media:req.body.media,
				credit:req.body.credit,
				caption:req.body.caption
			}
		});

		newData.save(function(err){
			if(err){
				console.log(err);
				req.session.error = err;
				return res.redirect('/data');
			}
			req.session.success ='post data success';
			console.log('post data success');
			res.redirect('/list');
		});
	});

	app.get('/list',checkLogin);
	app.get('/list',function(req,res){
		Data.get(req.session.user.name,function(err,datas){
			if(err){
				req.session.error=err;
				return res.redirect('/list');
			};
			res.render('list',{
				title:'data list',
				datas: datas,
			});
		});
	});

	app.get('/show/:user',function(req,res){
		User.get(req.params.user,function(err,user){
			if(!user){
				return res.end('user not exist!');
			}
			res.render('show',{
				title:'data list',
				layout: 'layout_timeline',
				username: req.params.user,
			});
		});
	});

	app.get('/showdata/:user',function(req,res){
		Data.get(req.params.user,function(err,datas){
			if(err){
				req.session.error=err;
				return res.redirect('/list');
			};
			res.json(
				{
					"timeline":
				    {
				        "headline":"Sh*t People Say",
				        "type":"default",
						"text":"People say stuff",
						"startDate":"2012,1,26",
				        "date": datas
				    }
				}
			);
		});
	});

}


function checkLogin(req,res,next){
	if(!req.session.user){
		req.session.error = 'you have not logined';
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.session.error = 'you have logined';
		return res.redirect('/list');
	}
	next();
}