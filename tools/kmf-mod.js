var spawn = require("../lib/spawn.js");
var file = require("../lib/file.js");
var path = require("path");
var kmfModule = path.join(__dirname, "../kmf_module");
var argv  = process.argv.slice(3);
var cwd = process.cwd();
var exec = require('child_process').exec;

function gitCmd(prop, version) {
	
	var commonds = {
		updateRemote: "git remote update",
		switchMaster: "git checkout master",
		switchVersion: "git checkout " + version
	};
	
	return commonds[prop];
}

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
			exec("git tag", function() {
				//exec(gitCmd("switchMaster"));		
			});
		} else {
			console.log("local is old!");
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
