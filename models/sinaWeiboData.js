var Data = require('./data'),
	Asset = require('./asset');

function SinaWeiboData(data){
	this.username = data.user.name;
	this.startDate = data.created_at;
	this.endDate = data.created_at;
	this.headline = data.user.name;
	if(data.user.description){
		this.headline += ":"+data.user.description; 
	}
	this.text = data.text;
	this._id = data.id;
	var s = {
		media : data.original_pic,
		credit : data.user.screen_name,
		caption : data.source
	};
	if(data.retweeted_status){
		s = {
			media : data.retweeted_status.original_pic,
			credit : data.retweeted_status.user.screen_name,
			caption : data.retweeted_status.source
		};
	}
	this.asset = new Asset(s);
};

module.exports = SinaWeiboData;

SinaWeiboData.getTimelineByWeiboResults = function get(weiboResults, callback){
	var weibos=[],count=0;
	console.log('weiboResults.statuses.length='+weiboResults.statuses.length);
	for(var i=0,l=weiboResults.statuses.length;i<l;i++){

	   // console.log(weiboResults.statuses[i]);
	   // console.log('count:'+count);
	   count+=1;
	   weibos.push(new SinaWeiboData(weiboResults.statuses[i]));
	}
	callback(null,weibos);
};
