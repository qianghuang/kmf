var exec = require("child_process").exec;
var devPath = path.join(cwd, "./test"); 
//process.chdir(devPath);
var spawn = require("../lib/spawn.js");

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