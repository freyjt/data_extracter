
// calls out to phantomjs child to remind me how to do that
function main() {
  var fs = require('fs');
  var webPage = require('webpage').create();
  var out_path = 'output.txt';
  var tabMod = require(phantom.libraryPath + '/getTable.js');
  console.log("Log in main");
  var url = 'http://www.espn.com/mlb/standings';
  var className = 'standings';
  something = tabMod.getTable(webPage, url, className);
  //phantom appears to thread out, phantom.exit doesn't make sense until we collect
  //  all the states
//  phantom.exit();
}


main();
