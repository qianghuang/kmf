var spawn = require("../lib/spawn.js");
var file = require("../lib/file.js");
var path = require("path");
var inquirer = require("inquirer");
var cacheFileName = "kmf_widget";
var kmfModule = path.join(__dirname, "../", cacheFileName);
var argv  = process.argv.slice(3);
var cwd = process.cwd();
var exec = require('child_process').exec;
var forEach = [].forEach;
var kmfConfPath = path.join(cwd, "./kmf.json");

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

/*!
 * git 相关命令操作
 * 
 */
var gitWidget = {
	cmd  : function(prop, version) {
	
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

var widget = {
	list: {},
	tags: [],
	get: function(tags){
		var self = this;
		if(tags && Array.isArray(tags) && tags.length > 0 ) {
			self.tags = tags;
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
			});
		}
		return this;
	},
	getList: function(widgetName) {
		var list = this.list
		,	installList = []
		,	curWidget = list[widgetName]
		;
		
		if(curWidget) {
			this.sort(curWidget);
			forEach.call(curWidget, function(curValue){
				installList[installList.length] = widgetName + "(v" + curValue.version + ")";
			});
		} else if(widgetName) {
			console.log("this widget is not found!");
		} else {
			for(var prop in list) {
				this.sort(list[prop]);
				installList[installList.length] = prop + "(v" + list[prop][0].version + ")";
			}
		}
		
		
		return installList;
	},
	/**
	 * @param  {String} widget : xxx(v2.0.0)
	 * @return {Object}
	 * {
	 * 	 widgetName : "",
	 *   version    : "",
	 *   tags       : ""
	 * } 
	 */
	parse: function(widget){
		var widgetName
		,	version
		,	tag
		,	reg = /(.*?)\(v(\d{1,2}\.\d{1,2}\.\d{1,2})\)/g
		,	forEach = [].forEach
		;
		
		widgetName = widget.replace(reg, "$1");
		version = widget.replace(reg, "$2");
		
		forEach.call(this.list[widgetName], function(curObj){
			if(curObj.version == version) {
				tag = curObj.tag;
			}
		});
		
		return {
			widgetName : widgetName,
			version    : version,
			tag        : tag
		};
		
	},
	sort: function(arr) {
		arr.sort(function(a, b){
			var v_a = a.version.split(".");
			var v_b = b.version.split(".");
			var result;
			
			for(var i = 0, len = v_a.length; i<len; i++) {
				result = parseInt(v_b[i]) - parseInt(v_a[i]);
				if(result != 0) {
					break;
				}
			}
			return result;
		});
		return this;
	},
	isWidget: function(widgetName){
		if(!!widgetName && /^[a-zA-Z][a-zA-Z_-]*/.test(widgetName)) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 拷贝组件，并自动替换图片资源
	 * @param {object array} selectList  : widget数组
	 * @param {object function} callBack : 回调
	 */
	copy: function(selectList, callBack){
		var curWidget
		,	self = this
		,	curSelect
		,	sourcePath
		,	targetPath 
		;
		
		
		if(Array.isArray(selectList) && selectList.length > 0) {
			curSelect = selectList.shift();
			curWidget = this.parse(curSelect);
			gitWidget.branch(curWidget.tag, function(){
				sourcePath = path.join(kmfModule, curWidget.widgetName);
				targetPath = path.join(cwd, cacheFileName, curWidget.widgetName);
				file.copy(sourcePath, targetPath);
				self.assetUpdate(targetPath);
				if(typeof callBack === "function") {
					callBack();
				}
				gitWidget.master(function(){
					self.copy.call(self, selectList);
				});
			});
		} else if(typeof selectList === "string") {
			self.copy.call(self, [selectList]);
		}
	},
	/**
	 * 选择组件
	 * 执行'git tag' 命令的回调
	 * @param {Object} error
	 * @param {Object} stdout
	 * @param {Object} stderr
	 */
	select: function(error, stdout, stderr){
		var tags
		,	installList
		,	options
		,	_type
		;
		
		tags = stdout.match(/(.*?)(_v)(\d{1,2}\.\d{1,2}\.\d{1,2})/g);
		
		if(widget.isWidget(argv[0])) {
			installList = widget.get(tags).getList(argv[0]);
			_type = "list";
		} else {
			installList = widget.get(tags).getList();
			console.log("checkbox");
			_type = "checkbox";
		}
		
		if(!installList.length) {
			process.exit();
			return ;
		}
		
		options = [{
			type    : _type,
			name    : "widget",
			message : "选择的组件是:",
			choices : installList
		}];
		
		inquirer.prompt(options, function(answers) {
			widget.copy.call(widget, answers.widget);
		});
	},
	/**
	 * 更新图片资源 
 	 * @param {Object} dirPath
	 */
	assetUpdate: function(dirPath){
		var files = file.getFiles(dirPath);
		var kmfConfig = file.readJson(kmfConfPath);
		var rootDir = kmfConfig["root"];
		var deployDir = kmfConfig["deploy"];

		files.forEach(function(curVal){
			if(path.extname(curVal) === ".css") {
				var content = file.read(curVal, "binary");
				content = content.replace(/(url\()(.*?(jpg|jpeg|gif|png|svg))(\))/g, function(){
					var args = arguments
					,	imgPath
					,	imgRelPath
					;
					
					imgPath = path.join(path.dirname(curVal), args[2]);
					imgRelPath = path.relative(rootDir, imgPath);
					imgRelPath = file.normalPath(path.join(deployDir, imgRelPath));
					
					return args[1] + imgRelPath + args[4];
				});
				
				file.write(curVal, content, "binary");
			}
		});
	}
};

if(!file.exists(kmfConfPath)) {
	console.log('\033[1;31m [error]:\033[21m kmf.json is not found!\033[0m please create it first');
	return ;
}
if(file.exists(kmfModule)) {
	gitWidget.update(function(){
		if(isNew(kmfModule)) {
			gitWidget.tagList(function(error, stdout, stderr){
				widget.select(error, stdout, stderr);
			});
		} else {
			gitWidget.pull(function(){
				gitWidget.tagList(function(error, stdout, stderr){
					widget.select(error, stdout, stderr);
				});
			});
		}
	});
} else {
	gitWidget.clone(function(){
		gitWidget.tagList(function(error, stdout, stderr){
			widget.select(error, stdout, stderr);
		});
	});
}
