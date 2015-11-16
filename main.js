

function Main( ) {
    var childProcess = require('child_process');
    childProcess.exec('dir /w', function(err, stdout, stderr) {
        if(err) {
            console.log("Error. " + err.code);
        }
        console.log(stdout);
    })
}

Main( );