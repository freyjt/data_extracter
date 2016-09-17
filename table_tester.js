
// calls out to phantomjs child to remind me how to do that
function main() {
  var fs = require('fs');
  var webPage = require('webpage').create();
  var out_path = 'output.txt';
  var tabMod = require(phantom.libraryPath + '/getTable.js');
  console.log("Log in main");
  var url = 'www.espn.com/mlb/standings';
  var className = 'standings';
  something = tabMod.getTable(webPage, url, className);
  phantom.exit();
}


main();
