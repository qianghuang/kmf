/*!
 * 文件相关操作
 * @example file.exists("d:/kmf/"), file.exists("d:/kmf/hq/", "../fe/");
 * @desc 判断路径是否存在 , 多个参数时合并路径
 * @example file.isDir("d:/kmf/")
 * @desc 是否是文件夹
 * @example file.isFile("d:/kmf/package.json")
 * @desc 是否是文件
 * @example file.blankDir("d:/xxx/")
 * @desc 是否是空文件夹
 * @example file.write("d:/kmf/readme.txt", "desc", {encoding: "utf-8"})
 * @desc  同步写文件，参数与fs.writeFileSync相同
 * @example file.read(filepath, options)
 * @desc  同步读取文件，返回内容
 * @example file.mkDir("d:/kmf/eh/fe/hq")
 * @desc 创建目录
 * @example file.copy("d:/kmf/eh/fe/", "e:/news/")
 * @desc 复制文件或文件夹下内容 至 目标文件夹下，默认复制非空目录
 * @example file.getFiles("d:/kmf")
 * @desc 获取目录下的文件路径列表
 * @example file.rmDir("d:/kmf/test");
 * @desc 删除目录及目录下的文件
 */

"use strict";
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

file.blankDir = function(filePath){
	return this.exists(filePath) && this.isDir(filePath) && !fs.readdirSync(filePath).length;
}

file.normalPath = function(filePath) {
	return filePath.replace(/\\/g, "/");
}

file.write = function(filePath, contents, options){
	var tips
	,	dirname = path.dirname(filePath)
	;
	
	if(file.exists(filePath)) {
		tips = "file \"" + filePath + "\" is modify.";
	} else {
		tips = "file \"" + filePath + "\" is create.";
	}
	
	if(!file.exists(dirname)) {
		file.mkDir(dirname);
	}
	fs.writeFileSync(filePath, contents, options);
	console.log(tips);
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
		contents = fs.readFileSync(filePath, options);
		return contents;
		
	} catch(e) {
		console.log("Unabe to read \" " + filePath +　" file (Error code:" + e.code + ")");
	}
	
};

file.readJson = function(filePath){
	var contends = file.read(filePath);
	
	if(contends) {
		return JSON.parse(contends);
	}
	
};
file.writeJson = function(filePath, pkgJson){
	file.write(filePath, JSON.stringify(pkgJson, null, 2));
}
/**
 * 复制文件/文件夹
 * @param src         {String}  : 源文件或文件夹
 * @param desc        {String}  : 目标文件夹
 * @param hasBlankDir {Boolean} : 是否复制空文件夹
 * @param callBack    {Function}: 复制完成时回调
 *
 */
file.copy = function(src, dest, hasBlankDir, callBack, options) {
	var fileList;
	var _callback;
	
	// 如果源文件不存在
	if(!file.exists(src)) {
		
		console.log("source file not found!")
		
		return ;
	}
	
	if(!file.exists(dest)) {
		file.mkDir(dest);
	}
	
	fileList = file.getFiles(src, hasBlankDir);
	
	fileList.forEach(function(filename){
		var newSrc = file.isDir(src) ? src : path.dirname(src);
		var newPath = path.join(dest, path.relative(newSrc, filename));
		var newContent;
		var fileDirName;
		if(file.isDir(filename)) {
			file.mkDir(newPath);
		} else {
			newContent = file.read(filename);
			fileDirName = path.dirname(newPath);
			
			if(!file.exists(fileDirName)) {
				file.mkDir(fileDirName);
			}
			file.write(newPath,newContent);
		}
	});
	
	_callback = (typeof hasBlankDir === "function") ? hasBlankDir : callBack;
	
	if(typeof _callback === "function") {
		_callback();
	}
	
};

/**
 * 递归获取子文件与子文件夹
 * @param rootDir      {String}   : 根目录
 * @param hasBlankDir  {Boolean}  : 是否返回空目录
 * @param subDir       {String}   : 下级目录
 *
 */
file.getFiles = function(rootDir, hasBlankDir, subDir){
	var recursePath = subDir ? path.join(rootDir, subDir) : rootDir;
	var fileList = [];
	
	if(!file.exists(rootDir)) {
		console.log("this file or directory is not found");
		return fileList;
	}
	
	if(file.blankDir(rootDir)) {
		return fileList;
	} else if(file.isFile(rootDir)) {
		fileList.push(file.normalPath(rootDir));
		return fileList;
	}
	if(hasBlankDir && file.blankDir(recursePath)) {
		fileList.push(file.normalPath(recursePath));
	}
	
	fs.readdirSync(recursePath).forEach(function(filename){
		var _filePath = path.join(recursePath, filename);
		if(file.isDir(_filePath)) {
			fileList = fileList.concat(file.getFiles(rootDir, hasBlankDir, path.join(subDir || "", filename)));
		} else {
			fileList.push(file.normalPath(_filePath));
		}
	});
	
	return fileList;
	
};

file.child = function(filePath) {
	var childFile = [];
	if(file.exists(filePath)) {
		childFile = fs.readdirSync(filePath);
	}
	return childFile;
}
/**
 *  
 */
file.rmDir = function(dirPath){
	if(file.isDir(dirPath)) {
		fs.readdirSync(dirPath).forEach(function(curFile){
			var _filePath = path.join(dirPath, curFile);
			file.rmDir(_filePath);
		});
		fs.rmdirSync(dirPath)
	} else if(file.isFile(dirPath)) {
		fs.unlinkSync(dirPath);
	}
}
