/*!
 * git 相关命令
 * 
 */
var exec = require("child_process").exec;

module.exports = function(argv){
	var baseCmd = "git "
	,	curCmd = ""
	,	git
	;
	
	git = {
		pull : "git pull origin master",
		status: "git status -s",
		build: "kmf dev toefl build"
	};
	
	/**
	 * 解析 git status -u 返回的结果
	 *  
	 */
	function parseStd(stdout) {
		var files
		,	items
		;
		
		stdout = stdout.trim();
		files = stdout.replace(/(.*? )(.*?)/g, "$2");
		files = files.split(/\n/g);
		items = getItem(files);
		
		return {
			files : files,
			items : items
		};
	}
	
	
	/**
	 * 获取项目
	 *  
	 */
	function getItem(files) {
		var cwd = process.cwd();
		
		console.log(cwd);
	}
	
	
	if(argv.length == 3) {
		curCmd = baseCmd + argv[0];
		exec(git.status, function(err, stdout, stderr) {
			//console.log(err);
			if(!err) {
				parseStd(stdout);
			}
			//console.log(stderr);
		});
	}
	//console.log(argv.length);
	//console.log(argv);
};
