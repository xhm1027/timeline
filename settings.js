module.exports = {
	cookieSecret: 'timelinebyxhm',
	db: 'heroku_app12832052',
	host: 'ds033907.mongolab.com',
	port: '33907',
	user: 'mongolab.xhm',
	password: 'mongolabtimeline',
	mongoUri : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://mongolab.xhm:mongolabtimeline@ds033907.mongolab.com:33907/heroku_app12832052?safe=true',
};