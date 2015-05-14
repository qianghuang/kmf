/*!
 * 将shtml转化成html
 * 并将静态资源地址转化为http://code.enhance.cn
 *  
 */
var file  = require("../lib/file.js")
,	path  = require("path")
,	argv  = process.argv.slice(3)
,	cmd   = argv.slice(0)
,	cwd   = process.cwd()
,	sourcePath
,	sRelativePath
,	sourceFiles
,	targetPath
,	tRelativePath
;

sRelativePath = argv[0] || "./";
tRelativePath = argv[1] || sRelativePath;
sourcePath = path.join(cwd, sRelativePath);
targetPath = path.join(cwd, tRelativePath);
sourceFiles = file.getFiles(sourcePath);

if(file.isFile(sourcePath)) {
	sourcePath = path.dirname(sourcePath);
}
sourceFiles.forEach(function(filename){
	var content
	,	extname = path.extname(filename)
	,	outExt  = ".html"
	,	relFile = path.relative(sourcePath, filename).replace(new RegExp(extname+"$"), outExt)
	,	dirName = path.dirname(filename)
	,	regInclude = /<\!--#include .*\"(.*)\"-->/g
	,	regHost = /(<link.*?\"|<script.*?src.*?"|<img.*?\"|base *?\: *?\"|url\()(http:\/\/code1.enhance.cn\/|\/)(.*?\"|.*?\))/g
	,	onlineHost = "http://code.enhance.cn/"
	,	targetFile = path.join(targetPath, relFile)
	;
	
	
	if(extname === ".shtml") {
		content = file.read(filename, "binary");
		content = content.replace(regInclude, function($0,$1) {
			var _childfile = path.join(dirName, $1);
			var _childContent = file.read(_childfile, "binary");
			return _childContent;
		});
		content = content.replace(regHost, "$1" + onlineHost + "$3");
		file.write(targetFile, content, "binary");
	}
});
