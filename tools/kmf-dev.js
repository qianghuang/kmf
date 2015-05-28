/*!
 * grunt
 */
module.exports = function(argv){
	var spawn = require("../lib/spawn.js")
	,	file  = require("../lib/file.js")
	,	path  = require("path")
	,	cmd   = argv.slice(0)
	,	cwd   = process.cwd()
	,	gruntPath
	,	projectList
	,	projectName
	;
	
	projectName = argv[0] || "";
	projectList = projectName.split(",");
	
	/**
	 * 
	 * @param {Object} appLists    : 项目名称数组
	 * @param {Object} currentPath : 当前工作目录
	 * 
	 */
	var exeCmd = function(appLists, currentPath) {
		var projectPath
		,	proName
		,	curCmd = cmd.slice(0)
		;
		
		if(Array.isArray(appLists) && !!appLists.length) {
			proName = appLists.shift();
			projectPath = path.join(currentPath, proName);
			
			if(!file.isDir(projectPath)) {
				console.log(proName + " is not found!");
				return ;
			}
			
			process.chdir(projectPath);
			curCmd.splice(0,1, "grunt");
			curCmd = curCmd.join(" ");
			spawn(curCmd).on("close", function(){
				exeCmd(appLists, cwd);
			});
		}
		
	};
	
	exeCmd(projectList, cwd);
	
};
