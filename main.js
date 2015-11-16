

function Main( ) {
    //test the os and set the split string for
    //  return
    var os = require('os');
    if(/^win/.test(os.platform))
        var lineEnd = '\r\n';
    else var lineEnd = '\n';
    
    var semCon   = require('semaphore');
    var semap    = semCon(1);
    var outerSem = semCon(1)
    var i, j; //just an index man
    var childProcess = require('child_process');
    var testID       = 'cle';

    var rostStr      = 'phantomjs getRoster.js ' + testID;
    var espnIdArr = [];
    var playerArr = [];
    //experimenting with not returning
    outerSem.take(function( ) {
        exe = childProcess.exec(rostStr, function(err, stdout, stderr) {
            if(!err) {
                stdout = stdout.split(lineEnd); // @TODO test: will this change on unix?
                for(i = 0; i < stdout.length; i++) {
                    //test the output for some identifying features of the JSON string
                    //  imperfect to say the least
                    if(stdout[i][0] == '{' && stdout[i].length > 50) {
                        // console.log(stdout[i]);
                        unpacked = JSON.parse(stdout[i]);
                        // console.log(unpacked);

                        semap.take( function() {
                            idsByClosure(unpacked);
                        });
                    }
                }
                outerSem.leave();
            } else {console.log("there was an error"); }
            
        }); 
    });
//espnidArr doesn't even exist here...
// well that's kidna a weird thing. This calls before idsByClosure
//....are you going to have to spawn all of the children within the major process
    exe.on('exit', function( ) {
        console.log("Exit call.");
        console.log(espnIdArr.length);
    });

    console.log(espnIdArr.length);
    // console.log(espnIdArr);
    //don't delete this untill you have the main script written
    //  seriously..just...be cool about this
    //@TODO add the playerid to this string. Probably going to need
    //  to iterate over a returned list. DUUUH
    // var gameLogProc = 'phantomjs getGameLog.js ';
    // exe = childProcess.exec(gameLogProc, function(err, stdout, stderr) {
    //     if(err) {
    //         console.log("Error. " + err.code);
    //     }
        
    // });
    // exe.stdout.on('data', function(data) {
    //     console.log(data + '\n\n\n')
    // });
    function idsByClosure( objIn ) {
        console.log("In idsByClosure");
        for(key in objIn) {
            espnIdArr.push(objIn[key]['espnId']);
            playerArr.push(objIn[key]['name']);
            console.log(playerArr);
            console.log(espnIdArr);
        }
        semap.leave();

    }
}

Main( );

