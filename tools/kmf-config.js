/**
 * modify config/kmfconfig.json
 *  
 */
var inquirer = require("inquirer");
var file = require("../lib/file.js");
var path = require("path");
var KMF = require("../lib/base.js");
var confPath = path.join(__dirname, "../config/kmfconfig.json");
var kmfConf = file.readJson(confPath);

module.exports = function(argv) {
	if(argv[0] === "widget") {
		inquirer.prompt([{
			type: "input",
			name: "respository",
			message: "widgetRespository:"
		}], function(widget){
			var respository = widget.respository.trim();
			var regexp = /^(git@|http\:\/\/)(.*?)(\.git)$/g;
			
			
			if(regexp.test(respository)) {
				kmfConf.widgetRespository = respository;
				file.writeJson(confPath, kmfConf);
			} else if(respository !== "") {
				console.log("git仓库地址格式不对！");
			}
		});
	}
};
