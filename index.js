var kmf = {}
,	help = require("./lib/help.js")
,	kmf = require("./lib/init.js")
,	file = require("./lib/file.js")
,	fs = require("fs")
,	path = require("path")
;


var argv = process.argv;
var cmd = argv[2];
var binPath = argv[1];
var cwd = process.cwd();
var templatePath = path.join(__dirname, "template");

if(cmd === "--help" || cmd === "-h" || cmd === "help") {
	help.getHelp();
} else if(cmd === "-v" || cmd === "--version" || cmd === "version") {
	help.version();
} else if(cmd === "init") {
	kmf.init();
} else if(cmd === "test") {
	kmf.init();
	console.log("curfile:" + __dirname);
	return;
	var testPath = path.join(process.cwd(), "./path/test/kmf");
	var copyPath = path.join(templatePath, "./std_webapp/a.json");
	var destPath = path.join(cwd, "./test/");
	//console.log(file.getFiles(copyPath + "as.json", true));
	file.copy(copyPath, destPath);
	file.write(destPath + "abc.txt", "ajfdj", {encoding: "utf-8"});
}
