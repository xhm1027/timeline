
/**
 * Module dependencies.
 */

var express = require('express')
  , expressLayouts = require('express-ejs-layouts')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
var settings = require('./settings');

var mongodb = require('mongodb').Db;

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://xhm1027:mongolab798155@ds033907.mongolab.com:33907/heroku_app12065550'; 

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ 
    secret: settings.cookieSecret
    })
  );

  app.use(expressLayouts);
  app.use(app.router);
  //app.use(express.router(routes));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  // app.use(express.errorHandler());
  app.use(function(req,res,next){
    
    res.locals.user = req.session.user;

    res.locals.error = function(req,res){
      var err = req.flash('error');
      if(err.length){
        return err;
      }else{
        return null;
      }
    };

    res.locals.success = function(req,res){
      var succ = req.flash('success');
      if(succ.length){
        return succ;
      }else{
        return null;
      }
    };

    next();
  });
});



routes(app);//这个是新加的
// app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
