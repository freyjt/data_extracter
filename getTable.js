
// table must have a specific classname
//  is this tableName?
//  There can be colgroups
function getTable(page, url, tableName) {
  page.open(url, function(status) {
    if(status == 'fail') {
      console.log("Unable to open webpage");
    }
    table = page.evaluate( function( ) {
      var tableau = document.getElementByClassName(tableName);
      //append all attributes collected with char s v at the end of a row
      var rows = tableau.childNodes
      rows.forEach(function(row) {
        console.log(row);
      });  
    });
  }
}
