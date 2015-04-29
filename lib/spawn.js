var spawn = require("child_process").spawn;
module.exports = function(command, args, options){
	
	options = options || {stdio: 'inherit'};
	args = args || [];
	
	if(process.platform === "win32") {
		args.unshift(command);
		args.unshift("/c");
		args.unshift("/d");
		command = "cmd";
	}
	return spawn(command, args, options);
	
};
