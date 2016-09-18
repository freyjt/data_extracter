

function main() {
  var fs = require('fs');
  var content = JSON.parse(fs.read('teamList.json'));
  var my_league = 'nfl';
  var my_names = content[my_league]['name_list'];
  var base_url = content[my_league]['url'];
  var table_name = content[my_league]['table_class'];

  var tab = require('./getTable.js');

  for(var name in my_names) {
    name = my_names[name];
    var pass_head = {"league": my_league, "table_name": table_name, "name": name};
    var pass_url = base_url.replace('<league>', my_league).replace('<name>', name);
    var out_path = my_league + "_" + name + "_" + Date.now() + ".team";
    tab.getTable(pass_url, table_name, pass_head, out_path);
  }
}
main();
