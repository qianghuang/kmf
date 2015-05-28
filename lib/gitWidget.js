/*!
 * git 相关命令操作
 * 
 */
var path = require("path");
var exec = require("child_process").exec;

module.exports = {
	cacheFileName: "kmf_widget",
	kmfModule: function() {
		return path.join(__dirname, "../", this.cacheFileName);
	},
	cmd: function(prop, version) {
		var cacheFileName = this.cacheFileName;
		var commonds = {
			clone   : "git clone git@182.92.225.8:/home/git/kmfApp/widget.git " + cacheFileName,
			update  : "git remote update",
			master  : "git checkout master",
			version : "git checkout " + version,
			tag     : "git tag",
			pull    : "git pull"
		};
		
		return commonds[prop];
	},
	clone: function(callBack){
		var cmd = this.cmd("clone");
		
		process.chdir(path.join(__dirname, "../"));
		exec(cmd, callBack);
		
	},
	update: function(callBack){
		var cmd = this.cmd("update");
		var kmfModule = this.kmfModule();
		
		process.chdir(kmfModule);
		console.log("checking...");
		
		exec(cmd, callBack);
	},
	pull: function(callBack){
		var cmd = this.cmd("pull");
		exec(cmd, callBack);
	},
	tagList: function(callBack){
		var cmd = this.cmd("tag");
		var kmfModule = this.kmfModule();
		
		process.chdir(kmfModule);
		exec(cmd, callBack);
	},
	branch: function(branch, callBack){
		var cmd = this.cmd("tag", branch);
		
		exec(cmd, callBack);
	},
	master: function(callBack) {
		var cmd = this.cmd("master");
		
		exec(cmd, callBack);
	}
};