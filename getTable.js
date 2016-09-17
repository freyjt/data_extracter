
// table must have a specific classname
//  is this tableName?
//  There can be colgroups
exports.getTable = function(page, url, tableName) {
  console.log("Called getTable for " + url + " " + tableName);
  page.open(url, function(status) {
    console.log("Called page.open");
    if(status == 'fail') {
      console.log("Unable to open webpage");
    } else { console.log("Opened web page"); }
    //page.evaluate goes here!
    table_csv =  page.evaluate( function(tableName) {
      csv_str = '';
      tableau = document.getElementsByTagName(tableName);
      csv_str += tableau[0].innerHTML;
      return csv_str;
    }, tableName);
    console.log(table_csv);
  });
};


