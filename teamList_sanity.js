function main() {
  function setFromArray(array_in) {
    var array_out = new Array();
    var in_ = array_in.slice();
    var len = array_in.length
    for(var i = 0; i < len; i++){
      appender = in_.shift();
      if(array_out.indexOf(appender) === -1) {
        array_out.push(appender)
      }
    }
    return array_out;
  }
  var fs = require('fs');
  var content = fs.read('teamList.json');
  var obj = JSON.parse(content);

  console.log(obj['_comment']);
  team_list = obj['nfl']['name_list'];
  team_set = setFromArray(team_list)
  console.log("nfl length: " + team_list.length);

  console.log("list is set?: " + (team_list.length === team_set.length));
  phantom.exit();

}
main();
