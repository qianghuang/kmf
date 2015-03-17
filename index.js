var kmf = {}
,	help = require("./lib/help.js")
,	kmf = require("./lib/init.js")
,	fs = require("fs")
,	path = require("path")
;


var argv = process.argv;
var cmd = argv[2];
var binPath = argv[1];

if(cmd === "--help" || cmd === "-h" || cmd === "help") {
	help.getHelp();
} else if(cmd === "-v" || cmd === "--version" || cmd === "version") {
	help.version();
} else if(cmd === "init") {
	console.log(argv);
	var pkgPath = path.join(binPath.replace(new RegExp(process.title +"$"), ""), "../template/std_webapp/package.json");
	var pkg = fs.readFileSync(pkgPath, "utf-8");
	console.log(pkg);
	fs.writeFile(process.cwd()+"/test.json",pkg, function(){
		console.log("File \"./test.json\" is created");
	});
}
