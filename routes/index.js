
/*
 * GET home page.
 */

var User = require('../models/user.js'),

	Data = require('../models/data.js'),

	SinaWeiboData = require('../models/sinaWeiboData'),

	crypto = require('crypto'),

	SinaWeibo = require('node-sina-weibo'),

	redirect_uri = 'http://timelineme.herokuapp.com/oauth/callback',

	weibo = new SinaWeibo("2843203249", "c9eb632a56aa5bce4b41ff050028bd54");

module.exports = function(app){
	app.get('/',function(req,res){
		// res.render('index', { 
		// 	title: 'timeline',
		// 	layout: 'layout_timeline'
		// });
		res.render('reg', { title: 'timeline register' });
	});

	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg', { title: 'timeline register' });
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		//check password
		if(req.body['password-repeat'] != req.body['password']){
			console.log('password not same');
			req.session.error = 'password not same';
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var newUser = new User({
			name: req.body.username,
			password:password,
		});
		//check user exist or not
		User.get(newUser.name,function(err,user){
			//user exist
			if(user){
				err = 'user already exist';
			}
			if(err){
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
				req.session.success ='reg success';
				console.log('reg success');

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
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		//check user exist or not
		User.get(req.body.username,function(err,user){
			//user not exist
			if(!user){
				err = 'user not exist';
			}else if(password!=user.password){
				err = 'password error';
			}
			if(err){
				req.session.error = err;
				console.log(err);
				return res.redirect('/login');
			}
			req.session.user = user;
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
			Data.get(req.params.user,function(err,datas){
				if(err){
					req.session.error=err;
					return res.redirect('/list');
				};

				res.render('show',{
					title:'data list',
					layout: 'layout_timeline',
					username: req.params.user,
					datas:JSON.stringify(datas),
				});
			});
		});
	});

	app.get('/dataDel',checkLogin);
	app.get('/dataDel/:id',function(req,res){
		Data.remove(req.params.id,function(err,num){
			console.log('del num:'+num);
			if(err){
				req.session.error = err;
			}else if(num>=1){
				req.session.success ='delete success';
			}else{
				req.session.error = 'delete fail';
			}

			return res.redirect('/list');
		});
	});

	app.get('/oauth/callback',function(req,res){
		var code = req.query.code;
		console.log('code: ' + code);
		if(req.session.user){
			return res.redirect('/oauth_index?code='+code);
		}
		weibo.getAccessToken({
                code : code, // put here your authorize code which is got above via browser
                grant_type:'authorization_code',
                redirect_uri:'http://timelineme.herokuapp.com/oauth/callback'
            }, function (err, results, accessToken) {
                if (err) {
                	console.log('getAccessToken err:'+err);
                    res.end('getAccessToken err:'+err);
                    return;
                }
                console.log('We have got an accessToken: ' + accessToken);
                weibo.GET('statuses/user_timeline', {access_token : accessToken ,feature : 2, count:100 }, function (err, result, response) {
	                if (err) {
                		console.log('statuses/user_timeline:'+err);
	                	res.end('statuses/user_timeline:'+err);
	                	return;
	                }
	                SinaWeiboData.getTimelineByWeiboResults(result,function(err,weibos){
						 res.render('show',{
							title:'weibo list',
							layout: 'layout_timeline',
							username: 'weibo',
							datas:JSON.stringify(weibos),
						});
					});
	            });
            }
        );
	});

	app.get('/oauth_index',checkLogin);
	app.get('/oauth_index',function(req,res){
		var code = req.query.code;
		res.render('oauth/index',{
			title:'oauth index',
			code: req.query.code,
		});
	});

	app.get('/oauth_view',function(req,res){
		var code = req.query.code,
		save = req.query.save;
		console.log('code: ' + code);
		weibo.getAccessToken({
                code : code, // put here your authorize code which is got above via browser
                grant_type:'authorization_code',
                redirect_uri:redirect_uri
            }, function (err, results, accessToken) {
                if (err) {
                	console.log('getAccessToken err:'+err);
                    res.end('getAccessToken err:'+err);
                    return;
                }
                console.log('We have got an accessToken: ' + accessToken);
                weibo.GET('statuses/user_timeline', {access_token : accessToken ,feature : 2, count:100 }, function (err, result, response) {
	                if (err) {
                		console.log('statuses/user_timeline:'+err);
	                	res.end('statuses/user_timeline:'+err);
	                	return;
	                }
	                SinaWeiboData.getTimelineByWeiboResults(result,function(err,weibos){
	                	if(save==1){
                			console.log('weibos.length='+weibos.length);

	                		for(var i=0,l=weibos.length;i<l;i++){
	                			var weiboData = new Data({
									username:req.session.user.name,
									startDate: weibos[i].startDate,
									endDate: weibos[i].endDate,
									headline: weibos[i].headline,
									text: weibos[i].text,
									asset: {
										media:weibos[i].asset.media,
										credit:weibos[i].asset.credit,
										caption:weibos[i].asset.caption
									}
								});
                				console.log('data '+i+':'+weiboData);
	                			weiboData.save(function(err){
	                				console.log(err);
	                			});
	                		}
	                	}
						 res.render('show',{
							title:'weibo list',
							layout: 'layout_timeline',
							username: 'weibo',
							datas:JSON.stringify(weibos),
						});
					});
	            });
            }
        );
	});


}


function checkLogin(req,res,next){
	if(!req.session.user){
		// req.session.error = 'you have not logined';
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		// req.session.error = 'you have logined';
		return res.redirect('/list');
	}
	next();
}