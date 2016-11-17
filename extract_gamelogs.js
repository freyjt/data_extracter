function usage() {
  console.log("Usage:")
  console.log("  phantomjs extract_gamelogs.js <roster_directory>")
  console.log("    <roster_directory> should only contain rosters extracted with extract_rosters.js")
  console.log("    This isn't strictly true, but it will run a bit faster if this is the truth")
}
function main() {
  sys = require('system');
  if(sys.args.length < 2) usage();
  ros_dir = sys.args[1];
  fs = require('fs');
  if(!fs.isDirectory(ros_dir)) usage();
  file_list = fs.list(ros_dir);
  for(i in file_list) {
    if(fs.isDirectory(file_list[i])) continue;
    console.log(file_list[i]);
  }
}

main();
