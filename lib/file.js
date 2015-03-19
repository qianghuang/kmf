"use strict";
/*!
 * 文件相关操作
 * 
 */
var fs = require("fs");
var path = require("path");

// 定义接口
var file = module.exports = {};

file.write = function(filePath, contents, options){
	fs.writeFileSync(filepath, contents);
};
file.exists = function(){
	return fs.existsSync(path.join.apply(path, arguments));
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
	
	// 如果有
	if(!file.exists(src)) {
		
		console.log("source file not found!")
		
		return ;
	}
	
	if(!file.exists(dest)) {
		file.mkDir(dest);
	}
	
};
