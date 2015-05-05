/*!
 * 
 */
var spawn = require("../lib/spawn.js")
,	file  = require("../lib/file.js")
,	path  = require("path")
,	argv  = process.argv.slice(3)
,	cmd   = argv.slice(0)
,	cwd   = process.cwd()
,	gruntPath
,	projectName
;

projectName = argv[0] || "";
gruntPath = path.join(cwd, projectName);
if(!file.isDir(gruntPath)) {
	console.log("this project is not found!");
	return ;
}
process.chdir(gruntPath);
cmd.splice(0,1, "grunt");
cmd = cmd.join(" ");
spawn(cmd);
