var path = require("path");
var outpath = path.format({
    root : "/",
    dir : "/home/user/dir",
    base : "file.txt",
    ext : ".txt",
    name : "file"
});
console.log(outpath);
