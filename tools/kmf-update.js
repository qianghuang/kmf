var path = require("path");
var file = require("../lib/file.js");
var widget = require("../lib/widget.js");
var gitWidget = require("../lib/gitWidget.js");
var cacheFileName = "kmf_widget";
var kmfModule = path.join(__dirname, "../", cacheFileName);

module.exports = function(argv, cwd){
	updateWidget(argv, cwd);
	
};

// 更新组件
function updateWidget(argv, cwd) {
	if(file.exists(kmfModule)) {
		gitWidget.update(function(){
			if(isNew(kmfModule)) {
				return widget.update();
				gitWidget.tagList(function(error, stdout, stderr){
					widget.select(argv, cwd, error, stdout, stderr);
					widget.update();
				});
			} else {
				/*
				gitWidget.pull(function(){
					gitWidget.tagList(function(error, stdout, stderr){
						widget.select(error, stdout, stderr);
					});
				});
				*/
			}
		});
	} else {
	}
}
function isNew(gitPath) {
	var packedFile   = "./.git/packed-refs"
	,	originMaster = "./.git/refs/remotes/origin/master"
	,	originFile
	,	localFile    = "./.git/refs/heads/master"
	,	originContent
	,	localContent
	;
	
	if(file.exists(path.join(gitPath, originMaster))) {
		originFile = path.join(gitPath, originMaster);
		originContent = file.read(originFile, "binary");
		
	} else {
		originContent = getPackedOriginMaster(path.join(gitPath, packedFile));
	}

	getPackedOriginMaster(path.join(gitPath, packedFile));
	localFile  = path.join(gitPath, localFile);
	localContent = file.read(localFile, "binary");


	return originContent.trim() === localContent.trim();
};

function getPackedOriginMaster(packedFile) {
	var content = file.read(packedFile, "binary");
	var originReg = /([a-z0-9]{40}).*?refs\/remotes\/origin\/master/g;
	
	if(originReg.test(content)) {
		return RegExp.$1;
	} else {
		return "";
	}
}