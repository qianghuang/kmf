/*!
 * git 相关命令
 * 
 */
var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");
var file = require("../lib/file.js");

module.exports = function(argv){
	var git
	,	msg
	;
	
	git = {
		pull  : "git pull origin master",
		status: "git status -s",
		build : "kmf dev toefl build",
		add   : "git add --all :/",
		commit: "git commit -m ",
		push  : "git push"
	};
	
	/**
	 * 解析 git status -u 返回的结果
	 *  
	 */
	function parseStd(stdout) {
		var files
		,	items
		,	newFiles
		,	cwd = process.cwd()
		;
		
		stdout = stdout.trim();
		if(stdout === "") {
			return {
				files : [],
				items : []
			};
		}
		files = stdout.replace(/(.*? )(.*?)/g, "$2");
		files = files.split(/\n/g);
		
		newFiles = files.map(function(v, k, arr){
			var newVal;
			
			newVal = path.join(cwd, v);
			return file.normalPath(newVal);
		});
		
		items = getItem(newFiles);
		
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
		var newFiles = []
		,	pkg = "package.json"  // 项目标识？有点low
		,	docRoot = "setting.json"
		;
		
		files.forEach(function(v, k, arr){
			var dirName = path.dirname(v);
			var pkgPath = path.join(dirName, pkg);
			var rootPath = path.join(dirName, docRoot);
			
			if(file.exists(pkgPath)) {
				if(newFiles.indexOf(dirName) < 0) {
					newFiles.push(dirName);
				}
			} else if(!file.exists(rootPath)) {
				newFiles = newFiles.concat(getItem([].concat(dirName)));
			}
		});
		return newFiles;
	}
	
	function gitPull(callBack) {
		exec(git.pull, callBack);
	}
	
	function gitStatus(callBack) {
		exec(git.status, callBack);
	}
	
	function gitAdd(callBack) {
		exec(git.add, callBack);
	}
	
	function gitCommit(msg, callBack) {
		exec(git.commit + '"' + msg + '"', callBack);
	}
	
	function gitPush(callBack) {
		exec(git.push, callBack);
	}
	
	function buildAll(callBack) {
		var _cb = callBack;
		
		gitStatus(function(err, stdout, stderr){
			if(!err) {
				items = parseStd(stdout).items;
				
				var buildItems = function(items, callBack) {
					var curItem;
					var itemPath;
					
					if(items.length > 0) {
						curItem = items.pop();
						itemPath = path.relative(process.cwd(), curItem);
						itemPath = itemPath === "" ? "./" : itemPath;
						console.log("building...");
						exec("kmf dev " + itemPath + " build", function(err, stdout, stderr){
							console.log(stdout);
							buildItems(items, callBack);
						});
					} else {
						if(callBack) {
							callBack();
						}
					}
				};
				if(items.length < 1) {
					console.log("noting to build");
				} else {
					buildItems(items, _cb);
				}
			}
		});
	}
	
	if(argv.length == 3) {
		if(argv[0] === "push" && argv[1] === "-m") {
			msg = argv[2].trim();
			if(msg !== "") {
				gitPull(function(){
					buildAll(function(){
						console.log('execute "git add" command');
						gitAdd(function(){
							console.log('execute "git commit" command');
							gitCommit(msg, function(error, stdout, stderr){
								console.log('execute "git push" command');
								gitPush(function(err, stdout, stderr){
									console.log(stdout);
								});
							});
						});
					});
				});
			} else {
				console.log('[error] commit message is not empty');
			}
		} else {
			console.log('[error] command is not exist!\n', 'right command:\n', 'kmf git push -m "commit msg"');
		}
	} else {
		console.log('[error] command is not exist!\n', 'right command:\n', 'kmf git push -m "commit msg"');
	}
};
