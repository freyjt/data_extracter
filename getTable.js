
// table must have a specific classname
//  is this tableName?
//  There can be colgroups
exports.getTable = function(url, tableName, header, outPath) {
  var page = require('webpage').create();
  console.log("Called getTable for " + url + " " + tableName);
  var ex = require(phantom.libraryPath + "/callWithThrow.js");
  page.open(url, function(status) {
    console.log("Called page.open");
    if(status == 'fail') {
      console.log("Unable to open webpage");
    } else { console.log("Opened web page"); }
    //page.evaluate goes here!
    write_string =  page.evaluate( function(tableName, head) {
      csv_str = '';
      for(key in head) {
        csv_str += key.toUpperCase() + ": " + head[key] + "\n";
      }
      query_str = 'table.' + tableName;
      tableau = document.querySelectorAll(query_str); 
      // This reorganizes the rows so that all headings
      //  are at top; It's ok, but not very general
      if(tableau.length === 0) {
        csv_str += 'No data found\n';
      }
      for(var i = 0; i < tableau.length; i++) {
        var rowe = tableau[i].rows;
        for(var j = 0; j < rowe.length; j++) {
          var sell = rowe[j].cells;
          csv_str += rowe[j].className + ',';
          for(var k = 0; k < sell.length; k++) {
            // @TODO collect attributes 
            var here = sell[k];
            csv_str += here.textContent;
            if(k < sell.length - 1) csv_str += ",";
          }
          csv_str += "\n";
       
        }
      }
//     fs = require('fs');
//     fs.write(outPath, csv_str, 'w');
      return csv_str;
    }, tableName, header);
    console.log("::" + write_string);
//    fs = require('fs');
//    fs.write(outPath, write_string, 'w');
  });
};

