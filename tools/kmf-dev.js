var spawn = require("../lib/spawn.js");
var argv = process.argv;
var cwd = process.cwd();
process.chdir("./template");
spawn("grunt --verbose");
console.log(argv);
