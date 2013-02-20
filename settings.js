module.exports = {
	cookieSecret: 'timelinebyxhm',
	db: 'heroku_app12065550',
	host: 'ds033907.mongolab.com',
	port: '33907',
	mongoUri : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://xhm1027:mongolab798155@ds033907.mongolab.com:33907/heroku_app12065550?safe=true',
};