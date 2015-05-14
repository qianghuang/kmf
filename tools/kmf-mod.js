var spawn = require("../lib/spawn.js");
var file = require("../lib/file.js");
var path = require("path");
var kmfModule = path.join(__dirname, "../kmf_module");
var argv  = process.argv.slice(3);
var cwd = process.cwd();
var exec = require('child_process').exec;
var forEach = [].forEach;

function gitCmd(prop, version) {
	
	var commonds = {
		updateRemote: "git remote update",
		switchMaster: "git checkout master",
		switchVersion: "git checkout " + version
	};
	
	return commonds[prop];
}
var widget = {
	list: {},
	get: function(tags){
		var self = this;
		if(tags && Array.isArray(tags))
		forEach.call(tags, function(cur,index){
			var listobj = {};
			cur.match(/(.*?)(_v)(\d{1,2}\.\d{1,2}\.\d{1,2})/g);
			listobj.version = RegExp.$3;
			listobj.tag = cur;
			
			if(!self.list[RegExp.$1]) {
				self.list[RegExp.$1] = [listobj];
			} else {
				self.list[RegExp.$1].push(listobj);
			}
			console.log(RegExp.$1);
			console.log(RegExp.$2);
			console.log(RegExp.$3);
		});
		console.log(self.list["usercard"]);
	}
};
function isNew(gitPath) {
	var packedFile   = "./.git/packed-refs"
	,	originMaster = "./.git/refs/remotes/origin/master"
	,	originFile
	,	localFile    = "./.git/refs/heads/master"
	,	originContent
	,	localContent
	;
	
	if(file.exists(path.join(gitPath, originMaster))) {
		originFile = path.join(gitPath, originMaster);
		originContent = file.read(originFile, "binary");
		
	} else {
		originContent = getPackedOriginMaster(path.join(gitPath, packedFile));
	}

	getPackedOriginMaster(path.join(gitPath, packedFile));
	localFile  = path.join(gitPath, localFile);
	localContent = file.read(localFile, "binary");


	return originContent.trim() === localContent.trim();
};

function getPackedOriginMaster(packedFile) {
	var content = file.read(packedFile, "binary");
	var originReg = /([a-z0-9]{40}).*?refs\/remotes\/origin\/master/g;
	
	if(originReg.test(content)) {
		return RegExp.$1;
	} else {
		return "";
	}
}

if(file.exists(kmfModule)) {
	process.chdir(kmfModule);
	
	console.log("checking...");
	exec(gitCmd("updateRemote"), function() {
		if(isNew(kmfModule)) {
			exec("git tag", function(error, stdout, stderr) {
				//console.log(stdout.match(/.*?\d{1,2}\.\d{1,2}\.\d{1,2}/g));
				widget.get(stdout.match(/(.*?)(_v)(\d{1,2}\.\d{1,2}\.\d{1,2})/g));	
			});
		} else {
			console.log("local is old!");
			exec("git pull");
		}
	});
	return ;
	spawn("git remote update").on("close", function(){
		
		if(isNew(kmfModule)) {
			console.log("is new!");			
		} else {
			console.log("local is old!");
		}
		/*
		if(isNew()) {
			
		}
		var modlist = file.child(kmfModule);
		exec("git checkout usercard_v0.0.1", function(error, stdout, stderr){
			console.log(error);
			console.log(stdout);
			console.log(stderr);
		});
		*/
	});
} else {
	process.chdir(path.join(__dirname, "../"));
	spawn("git clone git@182.92.225.8:/home/git/kmfApp/widget.git kmf_module");
}
