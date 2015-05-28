var path = require("path");

var inquirer = require("inquirer");

var KMF = require("./base.js");
var file = require("./file.js");
var gitWidget = require("./gitWidget.js");

var cwd = process.cwd();
var cacheFileName = KMF.config.WIDGET_DIR;
var jsonFile = KMF.config.WIDGET_JSON;
var kmfConfPath = path.join(cwd, cacheFileName, jsonFile);    // kmf.json
var kmfModule = path.join(__dirname, "../", cacheFileName);   // widget本地git仓库
var defKmfConf = {
	"name": "kmfConfig",
	"root": "",
	"deploy": "/dist",
	"widget": {}
};
var kmfWidget = {};

module.exports = {
	list: {},
	tags: [],
	init: function(callBack) {
		
		var self = this;
		
		console.log(jsonFile, "is not found! create now!");
		
		inquirer.prompt({
			type    : "input",
			name    : "root",
			message : "document root"
		}, function(answers) {
			var promptPath = file.normalPath(path.resolve(cwd, answers.root));
			
			if(!file.exists(promptPath)) {
				console.log("该目录不存");
				return self.init(callBack);
			}
			
			defKmfConf.root = promptPath;
			
			file.writeJson(kmfConfPath, defKmfConf);
			if(typeof callBack === "function") {
				callBack();
			}
		});
		return this;
	},
	get: function(tags){
		var self = this;
		if(tags && Array.isArray(tags) && tags.length > 0 ) {
			self.tags = tags;
			tags.forEach(function(cur,index){
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
			curWidget.forEach(function(curValue){
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
		,	reg = /(.*?)\(v(\d{1,2}\.\d{1,2}\.\d{1,2})\).*/g
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
			kmfWidget[curWidget.widgetName] = curWidget.version;
			gitWidget.branch(curWidget.tag, function(){
				sourcePath = path.join(kmfModule, curWidget.widgetName);
				targetPath = path.join(cwd, cacheFileName, curWidget.widgetName);
				file.copy(sourcePath, targetPath);
				self.assetUpdate(targetPath, curWidget.version);
				if(typeof callBack === "function") {
					callBack();
				}
				// 如果拷
				if(!selectList.length) {
					self.updateKmfJson();
				}
				gitWidget.master(function(){
					self.copy.call(self, selectList, callBack);
				});
			});
		} else if(typeof selectList === "string") {
			self.copy.call(self, [selectList], callBack);
		}
	},
	/**
	 * 选择组件
	 * 执行'git tag' 命令的回调
	 * @param {Object} error
	 * @param {Object} stdout
	 * @param {Object} stderr
	 */
	select: function(argv, cwd, error, stdout, stderr){
		var tags
		,	installList
		,	options
		,	_type
		,	self = this
		;
		
		tags = stdout.match(/(.*?)(_v)(\d{1,2}\.\d{1,2}\.\d{1,2})/g);
		
		// 如果不存在kmf.json
		if(!file.exists(kmfConfPath)) {
			return this.init(function(){
				self.select.call(self, argv, cwd, error, stdout, stderr);
			});
		}
		
		if(this.isWidget(argv[0])) {
			installList = this.get(tags).getList(argv[0]);
			_type = "list";
		} else {
			installList = this.get(tags).getList();
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
			self.copy.call(self, answers.widget);
		});
	},
	/**
	 * 更新图片资源 
 	 * @param {Object} dirPath
 	 * @param {String} version
	 */
	assetUpdate: function(dirPath, version){
		var files = file.getFiles(dirPath)
		,	kmfConfig = file.readJson(kmfConfPath)
		,	rootDir = kmfConfig["root"]
		,	deployDir = kmfConfig["deploy"]
		,	self = this
		,	jsonFile = path.join(dirPath, "./widget.json");
		;

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
		
		// 更新版本
		self.updateVersion(jsonFile, version);
		
	},
	/**
	 * 读取kmf.json 
	 * @return json对象
	 */
	readKmf: function(){
		var filePath = kmfConfPath;
		return file.readJson(filePath);
	},
	/**
	 * 修改kmf.json 
	 * @param: {Object} jsonContent : json对象
	 */
	wirteKmf: function(jsonContent){
		var filePath = kmfConfPath;
		file.writeJson(filePath, jsonContent);
	},
	updateVersion: function(filePath, version){
		var widgetJson = file.readJson(filePath);
		
		widgetJson.version = version;
		file.writeJson(filePath, widgetJson);
	},
	// 更新kmf.json
	updateKmfJson: function() {
		var widgetJson = this.readKmf();
		
		KMF.extend(widgetJson.widget, kmfWidget);
		this.wirteKmf(widgetJson);
	},
	// 获取组件列表
	setList: function(callBack){
		var self = this;
		
		gitWidget.tagList(function(error, stdout, stderr){
			var tags = stdout.match(/(.*?)(_v)(\d{1,2}\.\d{1,2}\.\d{1,2})/g);
			var list;
			
			list = self.get(tags).list;
			
			for(var prop in list) {
				self.sort(list[prop]);
			}
			
			if(typeof callBack === "function") {
				callBack(list);
			}
			
		});
	},
	getExists: function() {
		var kmfJson = this.readKmf();
		var existsList = Object.keys(kmfJson.widget);
		var self = this;
		
		existsList = existsList.map(function(curVal){
			var newObj = {};
			newObj[curVal] = kmfJson.widget[curVal];
			return newObj;
		});
		
		return existsList;
	},
	update: function() {
		var self = this;
		var exists = this.getExists();
		
		this.setList(function(list){
			var updateList = []
			,	listLen
			;
			
			
			exists.forEach(function(curVal){
				var curWidget = Object.keys(curVal)[0];
				var lastVersion = list[curWidget][0].version;
				var curVersion = curVal[curWidget];
				
				if(lastVersion !== curVersion) {
					updateList.push(curWidget + "(v" + lastVersion + ")" + "[v" + curVersion + "]");
				}
			});
			
			if((listLen = updateList.length) > 0) {
				options = [{
					type    : "checkbox",
					name    : "widget",
					message : "有" + listLen + "个组件需要更新!",
					choices : updateList
				}];
				
				inquirer.prompt(options, function(answers) {
					self.copy.call(self, answers.widget);
				});
			} else {
				console.log("所有组件已经是最新版本！无需更新");
			}
			
		});
		
	}
};