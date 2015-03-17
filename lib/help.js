/*!
 * help info
 * 
 */

// 帮助信息
var conf = [
	"",
	"Usage:",
	"    kmf <command> [<args>] [options]",
	"",
	"command:",
	"    install                安装组件",
	"    init                   初始化项目",
	"    dev                    监听",
	"    push                   上传开发机",
	"    online                 上线",
	"",
	"Options:",
	"    -h, --help             显示帮助信息",
	"    -v, --version          显示版本"
];

var pkg = require("../package.json");

// 显示版本
exports.version = function(){
	console.log("kmf v" +pkg.version);
};

// 显示帮助信息
exports.getHelp = function(){
	console.log(conf.join("\n"));
};
