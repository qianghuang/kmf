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
	console.log("local---" +　__dirname);
	console.log(argv);
	var pkgPath = path.join(binPath.replace(new RegExp(process.title +"$"), ""), "../template/std_webapp/package.json");
	var pkg = fs.readFileSync(pkgPath, "utf-8");
	console.log(pkg);
	file.copy(__dirname, "./test/");
	fs.writeFile(process.cwd()+"/test.json",pkg, function(){
		console.log("File \"./test.json\" is created");
	});
} else if(cmd === "test") {
	var testPath = path.join(process.cwd(), "./path/test/kmf");
	var copyPath = path.join(templatePath, "./std_webapp/");
	var destPath = path.join(cwd, "./test/");
	file.copy(copyPath, destPath);
}
