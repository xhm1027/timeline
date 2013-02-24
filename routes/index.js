
/*
 * GET home page.
 */

module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index', { 
			title: 'timeline',
			layout: 'layout_timeline'
		});
	});
	app.get('/reg',function(req,res){
		res.render('reg', { title: 'timeline register' });
	});
	app.post('/reg',function(req,res){
		//check password
		if(req.body['password-repeat'] != req.body['password']){
			//req.session.messages = 'password not same';
			console.log('password not same');
			// req.flash('password not same');
			req.session.error = 'password not same';
			return res.redirect('/reg');
		}
		var User = require('../models/user.js');
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
				req.session.user = newUser;
				req.session.success ='reg success';
				console.log('reg success');

				//req.session.messages ='reg success';
				res.redirect('/reg');
			});
		});
	});
}
