/*!
 * 接口定义 
 */
var config = require("./base/config.js");
var KMF = module.exports = {};

// 常量配置
KMF.config = config;
KMF.extend = function(tar, src){
	var config
	,	key
	;
	
	for (key in src) {
		
		config = src[key];
		
		if (tar[key] && typeof config === "object" && !Array.isArray(config)) {
			KMF.extend(tar[key], config);
		} else {
			tar[key] = src[key];
		}
	}
	return tar;
};
