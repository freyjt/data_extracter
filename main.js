

function Main( ) {
    var childProcess = require('child_process');
    childProcess.exec('phantomjs getGameLog.js 1966', function(err, stdout, stderr) {
        if(err) {
            console.log("Error. " + err.code);
        }
        console.log(stdout);
    })
}

Main( );