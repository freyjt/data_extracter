

function Main( ) {
    var childProcess = require('child_process');
    var testID       = 1966;

    var gameLogProc = 'phantomjs getGameLog.js ' + testID;
    childProcess.exec(gameLogProc, function(err, stdout, stderr) {
        if(err) {
            console.log("Error. " + err.code);
        }
        console.log(stdout);
    })
}

Main( );