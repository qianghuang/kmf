"use strict";
/*!
 * 文件相关操作
 * 
 */
var fs = require("fs");
var path = require("path");

// 定义接口
var file = module.exports = {};

file.exists = function(){
	return fs.existsSync(path.join.apply(path, arguments));
};

file.isDir =  function(filePath){
	return file.exists(filePath) && fs.statSync(filePath).isDirectory();
};

file.isFile = function(filePath) {
	return file.exists(filePath) && fs.statSync(filePath).isFile();
};

file.write = function(filePath, contents, options){
	fs.writeFileSync(filepath, contents);
};
/**
 * @param dirPath {String} 目录文件夹路径
 *  
 */
file.mkDir = function(dirPath){
	if(!file.exists(dirPath)) {
		try {
			fs.mkdirSync(dirPath);
		} catch(e) {
			// 如果没有此文件夹
			if(e.code == "ENOENT") {
				file.mkDir(path.dirname(dirPath));
				file.mkDir(dirPath);
			} else {
				console.log("mkdir error, error code: " + e.code);
			}
			
		}
	}
}

file.read = function(filePath, options) {
	var contents;
	try {
		contents = fs.readFileSync(filePath);
		return contents;
		
	} catch(e) {
		console.log("Unabe to read \" " + filePath +　" file (Error code:" + e.code + ")");
	}
	
};
/**
 * 复制文件/文件夹
 * 
 */
file.copy = function(src, dest, options) {
	var rwOpts = options ? options : {encoding: "utf-8"};
	
	
	// 如果源文件不存在
	if(!file.exists(src)) {
		
		console.log("source file not found!")
		
		return ;
	}
	
	if(!file.exists(dest)) {
		file.mkDir(dest);
	}
	
	if(file.isDir(src)) {
		console.log(file.getdirlist(src));
		//file.recurse(src);
	}
	
	
};
file.recurse = function recurse(rootdir, callback, subdir) {
  var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
  var fileList = {};
  fs.readdirSync(abspath).forEach(function(filename) {
  	console.log("----" + filename + "----\n");
    var filepath = path.join(abspath, filename);
    if (fs.statSync(filepath).isDirectory()) {
      recurse(rootdir, callback, path.join(subdir || '', filename || ''));
    } else {
    	console.log("is file");
      //callback(filepath, rootdir, subdir, filename);
    }
  });
};
file.getdirlist = function(source, include, exclude){
	var _this = this;
	var result = [];
	//var source = f.realpath(source);
	if(source){
		if(file.isDir(source)){
			fs.readdirSync(source).forEach(function(name){
				result = result.concat( _this.getdirlist.call(_this,source + '/' + name, include, exclude) );
			});
		} else if(file.isFile(source)){
			result.push(source.replace("//","/"));
		}
	}
	return result;
}