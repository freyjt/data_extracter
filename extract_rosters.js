

function main() {
  var fs = require('fs');
  var content = JSON.parse(fs.read('teamList.json'));
  var my_league = 'nfl';
  var my_names = content[my_league]['name_list'];
  var base_url = content[my_league]['url'];
  var table_name = content[my_league]['table_class'];
  var child = require('child_process').spawn;
  var children = {};
  for(var name in my_names) {
    name = my_names[name];
    var pass_url = base_url.replace('<league>', my_league).replace('<name>', name);
    var out_path = my_league + "_" + name + "_" + Date.now() + ".team";
    var pass_head = {"league": my_league,
                     "table_name": table_name,
                     "name": name,
                     "url": pass_url};
    var head = JSON.stringify(pass_head).split('"').join('\\"');
    console.log(head); 
    children[name] = child('phantomjs', ['getTable.js', pass_url, table_name, head, out_path]);
    children[name].stdout.on('data', function(data) {
      console.log(data);
    });
    children[name].stderr.on('data', function(data) {
      console.log(data);
    });
    children[name].on('exit', function(code) {
      console.log(" exited with: " + code);
    });
  }
}
main();
