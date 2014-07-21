module.exports = {
	cookieSecret: 'timelinebyxhm',
	db: 'heroku_app12832052',
	host: 'ds033907.mongolab.com',
	port: '33797',
	user: 'mongolab.xhm',
	password: 'mongolab1027',
	mongoUri : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://mongolab.xhm:mongolabtimeline@ds033797.mongolab.com:33797/heroku_app12832052?safe=true',
};
