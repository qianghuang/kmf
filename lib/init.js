/*!
 * 初始化项目
 * 
 */
var path = require("path");
var inquirer = require("inquirer");
var file = require("./file.js");


var callBacks = {
	webapp: function(destPath){
		var pkgPath = path.join(destPath, "./package.json");
		var pkg = file.readJson(pkgPath);
		pkg.name = file.normalPath(destPath).split("/").pop();
		file.writeJson(pkgPath, pkg);
	},
	widget:function(destPath){
		var pkgPath = path.join(destPath, "./widget.json");
		var pkg = file.readJson(pkgPath);
		
		pkg.name = file.normalPath(destPath).split("/").pop();
		file.writeJson(pkgPath, pkg);
	}
};

exports.init = function(argv){
	var templatePath = path.join(__dirname, "./../template");
	var generatorName = argv[0];
	var list = file.child(templatePath);
	
	if(argv.length < 1) {
		
		var prop = "projectName";
		
		var options = [{
			type    : "list",
			name    : prop,
			message : "请选择项目模板:",
			choices : list
		}];
		var srcPath;
		var destPath;
		
		
		
		inquirer.prompt(options, function(answers) {
			var srcPath = path.join(templatePath, answers[prop]);
			var destPath = process.cwd();
			if(file.blankDir(destPath)) {
				file.copy(srcPath, destPath, function(){
					var _callBack = callBacks[answers[prop]] || callBacks.webapp;
					callBacks[answers[prop]](destPath);
				});
			} else {
				console.log("创建失败！原因：目录为非空目录");
			}
		});
	} else {
		var srcPath = path.join(templatePath, generatorName);
		var destPath = process.cwd();
		
		if(!file.exists(srcPath)) {
			console.log("不存在此模板！");
			return ;
		}
		
		if(file.blankDir(destPath)) {
			file.copy(srcPath, destPath, function(){
				callBacks[generatorName](destPath);
			});
		} else {
			console.log("创建失败！原因：目录为非空目录");
		}
	}
};
