var kmf = {}
,	help = require("./lib/help.js")
,	kmf = require("./lib/init.js")
,	file = require("./lib/file.js")
,	fs = require("fs")
,	path = require("path")
;


var argv = process.argv;
var cmd = argv[2];
var argv3 = argv.slice(3);
var cwd = process.cwd();
var templatePath = path.join(__dirname, "template");


if(cmd === "--help" || cmd === "-h" || cmd === "help") {
	help.getHelp();
} else if(cmd === "-v" || cmd === "--version" || cmd === "version") {
	help.version();
} else if(cmd === "init") {
	kmf.init();
} else {
	var tools = path.join(__dirname, "./tools/kmf-"+ cmd);
	if(!file.exists(tools + ".js")) {
		console.log("不支持此命令，来吧，创建一个吧！");
		help.getHelp();
	} else {
		require(tools);
	}
}
