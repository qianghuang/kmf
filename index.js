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

file.write(path.join(__dirname, "cwd.d"), cwd);

if(cmd === "--help" || cmd === "-h" || cmd === "help") {
	help.getHelp();
} else if(cmd === "-v" || cmd === "--version" || cmd === "version") {
	help.version();
} else if(cmd === "init") {
	kmf.init();
} else if(cmd === "dev") {
	var spawn = require("./lib/spawn.js");
	
} else if(cmd === "test") {
	console.log(argv3);
	var exec = require("child_process").exec;
	var devPath = path.join(cwd, "./test"); 
	//process.chdir(devPath);
	var spawn = require("./lib/spawn.js");
	
	//console.log(process.cwd());
	exec("node kmf --help", function(error, stdout, stderr){
		console.log(stdout);
	});
	return;
	
	spawn('dir',[], {
		stdio: 'inherit',
		customFds: [0, 1, 2]
	});
	var testPath = path.join(process.cwd(), "./path/test/kmf");
	var copyPath = path.join(templatePath, "./std_webapp/a.json");
	var destPath = path.join(cwd, "./test/");
	//console.log(file.getFiles(copyPath + "as.json", true));
	file.copy(copyPath, destPath);
	file.write(destPath + "abc.txt", "ajfdj", {encoding: "utf-8"});
}
