/*!
 * 初始化项目
 * 
 */
var path = require("path");
var inquirer = require("inquirer");
var file = require("./file.js");
exports.init = function(argv){
	var templatePath = path.join(__dirname, "./../template");
	if(!argv) {
		
		var list = file.child(templatePath);
		var prop = "projectName";
		var options = [{
			type    : "list",
			name    : prop,
			message : "请选择项目模板:",
			choices : list
		}];
		
		inquirer.prompt(options, function(answers) {
			var srcPath = path.join(templatePath, "./" + answers[prop]);
			var destPath = process.cwd();
			if(file.blankDir(destPath)) {
				file.copy(srcPath, destPath);
			} else {
				console.log("创建失败！原因：目录为非空目录");
			}
		});
		
	}
};
