
// table must have a specific classname
//  is this tableName?
//  There can be colgroups
exports.getTable = function(page, url, tableName) {
  console.log("Called getTable for " + url + " " + tableName);
  var ex = require(phantom.libraryPath + "/callWithThrow.js");
  page.open(url, function(status) {
    console.log("Called page.open");
    if(status == 'fail') {
      console.log("Unable to open webpage");
    } else { console.log("Opened web page"); }
    //page.evaluate goes here!
    table_csv =  page.evaluate( function(tableName, oth) {
      csv_str = tableName + " " + oth +  "\n";
      query_str = 'table.' + tableName;
      tableau = document.querySelectorAll(query_str); 
      csv_str += Object.keys(tableau) + "\n";
      csv_str += Object.keys(tableau[0]) + "\n";
      for(var i = 0; i < tableau.length; i++) {
        var rowe = tableau[i]['rows'];
        for(var j = 0; j < rowe.length; j++) {
          var sell = tableau[i]['rows'][j]['cells'];
          for(var k = 0; k < sell.length; k++) {
            // @TODO collect attributes 
            var here = sell[k];
            csv_str += here.textContent;
            if(k < sell.length - 1) csv_str += ",";
          }
          csv_str += "\n";
       
        }
      }
      return csv_str;
    }, tableName, 'othervar');
    console.log("csv " + table_csv + " ::");
  });
};

