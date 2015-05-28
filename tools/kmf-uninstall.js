var file = require("../lib/file.js");
var inquirer = require("inquirer");
var path = require("path");

var cleanWidget = function(widgetName, basePah, kmfConfPath) {
	var kmfConfig = file.readJson(kmfConfPath)
	,	widgets = []
	;
	
	Array.isArray(widgetName) ? widgets = widgetName : widgets.push(widgetName);
	
	if(!widgets.length) {
		return ;
	}
	
	widgets.forEach(function(curVal){
		file.rmDir(path.resolve(basePah, curVal));
		delete kmfConfig.widget[curVal];
	});
	
	file.writeJson(kmfConfPath, kmfConfig);
};

module.exports = function(argv, cwd){
	var baseName = "kmf_widget"
	,	dirPath
	,	kmfConfPath = path.resolve(cwd, baseName, "./kmf.json")
	,	kmfConfig
	,	existsWidget
	;
	
	if(!file.exists(kmfConfPath)) {
		console.log("该目录不是组件目录");
		return;
	}
	
	kmfConfig = file.readJson(kmfConfPath);
	existsWidget = Object.keys(kmfConfig.widget);
	dirPath = path.dirname(kmfConfPath);
	
	if(argv[0]) {
		if(kmfConfig.widget[argv[0]]) {
			cleanWidget(argv[0], dirPath, kmfConfPath);
		} else {
			console.log("该组件不存在！");
		}
	} else {
		var len = existsWidget.length;
		if(len > 1 ) {
			inquirer.prompt({
				type:"checkbox",
				name:"widget",
				message:"请选择要删除的组件",
				choices: existsWidget
			},function(answer){
				cleanWidget(answer.widget, dirPath, kmfConfPath);
			});
		} else if (len === 1) {
			inquirer.prompt({
				type:"confirm",
				name:"widget",
				message:"确实要删除 " + existsWidget[0] + "v(" + kmfConfig.widget[existsWidget[0]] + ")"
			},function(answer){
				if(answer.widget) {
					cleanWidget(existsWidget[0], dirPath, kmfConfPath);
				}
			});
		} else {
			console.log("not found widget!");
		}
	}
};
