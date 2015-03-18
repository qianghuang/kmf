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
 * 复制文件
 * 
 */
file.copy = function(src, dest, options) {
	var rwOpts = options ? options : {encoding: "utf-8"};
	var source = file.read(src, rwOpts);
	console.log("xxx----" +source);
};
