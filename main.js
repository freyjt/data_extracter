

function Main( ) {
    var childProcess = require('child_process');
    var testID       = 1966;

    var gameLogProc = 'phantomjs getGameLog.js ' + testID;
    exe = childProcess.exec(gameLogProc, function(err, stdout, stderr) {
        if(err) {
            console.log("Error. " + err.code);
        }
        
    });
    exe.stdout.on('data', function(data) {
        console.log(data + '\n\n\n')
    })
}

Main( );