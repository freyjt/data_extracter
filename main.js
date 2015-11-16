

function Main( ) {
    //test the os and set the split string for
    //  return
    var os = require('os');
    if(/^win/.test(os.platform))
        var lineEnd = '\r\n';
    else var lineEnd = '\n';
    

    var i, j; //just an index man
    var childProcess = require('child_process');
    var testID       = 'cle';

    var rostStr      = 'phantomjs getRoster.js ' + testID;
    var baseGameLog  = 'phantomjs getGameLog.js ';
    var espnIdArr = [];
    var playerArr = [];
    var gameLogStr= baseGameLog; //script call for getGameLog.js
    var gameLog; //returned
    var gameJSON;
    //experimenting with not returning

    retStr = childProcess.execSync( rostStr ).toString();
    retStr = retStr.split(lineEnd); // @TODO test: will this change on unix?
    for(i = 0; i < retStr.length; i++) {
        //test the output for some identifying features of the JSON string
        //  imperfect to say the least
        if(retStr[i][0] == '{' && retStr[i].length > 50) {

            unpacked = JSON.parse( retStr[i] );
            for(key in unpacked) {
                gameLogStr = baseGameLog + unpacked[key]['espnId'];
                console.log(gameLogStr);
                gameLog = childProcess.execSync( gameLogStr ).toString();
                
                gameLog = gameLog.split('\r\n'); //WHY does lineend not work
                //console.log(gameLog);
                for(j = 0; j < gameLog.length; j++) {

                    if(gameLog[j][0] == '{' && gameLog[j].length >= 50) {
                        gameJSON = JSON.parse( gameLog[j] );
                
                        j = gameLog.length;
                        
                        //@TODO handle the returned string.


                    } else if ( gameLog[j] == "Error. No data to return." ) {

                        console.log( "No data error from espnId: " );
                        console.log( "   " + unpacked[key]['espnId'] + " : " + unpacked[key]['name']);
                    }


                }
            }

        }
    }
    console.log(espnIdArr);
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
    function appendIdentifiers( objIn ) {
        for(key in objIn) {
            espnIdArr.push(objIn[key]['espnId']);
            playerArr.push(objIn[key]['name']);
        }
    }
}

Main( );

