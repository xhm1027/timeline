exports.doReg = function(req,res){
	//check password
    if(req.body['password-repeat'] != req.body['password']){
      //req.session.messages = 'password not same';
      reg.flash('error','password not same');
      console.log('password not same');
      return res.redirect('/reg');
    }
    var User = require('../models/user.js');
    var md5 = require('crypto').createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
      name: req.body.username,
      password: password,
    });
    //check user exist or not
    User.get(newUser.name,function(err,user){
      //user exist
      if(user){
        err = 'error','user already exist';
      }
      if(err){
        //  req.session.messages = err;
        reg.flash('error',err);
        console.log(err);
        return res.redirect('/reg');
      }
      newUser.save(function(err){
        if(err){
          console.log(err);
          return res.redirect('/reg');
        }
        req.session.user = newUser;
        reg.flash('success','reg success');
        console.log('reg success');
        //req.session.messages ='reg success';
        res.redirect('/');
      });
    });
}