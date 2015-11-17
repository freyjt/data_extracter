

function Main( ) {
    ///ALL YOU NEED IS TO SPLIT ON A WHITESPACE REGEX YOU NOOB IDIOT
    //test the os and set the split string for
    //  return
    var os = require('os');
    if(/^win/.test(os.platform))
        var lineEnd = '\r\n';
    else var lineEnd = '\n';
    
    var fs = require('fs');
    var i, j, a; //just an index man
    var childProcess = require('child_process');
    var testId       = 'cle';
    var baseRostStr  = 'phantomjs getRoster.js ';
    
    var baseGameLog  = 'phantomjs getGameLog.js ';
    var espnIdArr = [];
    var playerArr = [];
    var allInfo   = {};
    var gameLogStr= baseGameLog; //script call for getGameLog.js
    var gameLog; //returned
    var gameJSON;
    //experimenting with not returning
    var errorLog = [];

    teamStr = fs.readFileSync('teamList.txt', 'utf-8');

    console.log(teamStr);
    teams = teamStr.split(/\s+/);
    console.log("Teams being accessed: " + teams);
    for(a = 0; a < teams.length; a++) {

        teamId = teams[a]; 
        var rostStr      = 'phantomjs getRoster.js ' + teamId;
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
                    
                            unpacked[key]['gameLog'] = gameJSON;
                            
                            //@TODO handle the returned string.

                            j = gameLog.length;
                        } else if ( gameLog[j].substr(0, 5) == "Error" ) {
                            errorLog.push("" + gameLog[j] + " : " + unpacked[key]['espnId'] + " : " + unpacked[key]['name']);
                            unpacked[key] = "Unavailable";
                        }


                    }
                }

            }
        }
        allInfo[teamId] = unpacked;
    }
    //**********************



    console.log( unpacked );
    console.log( errorLog );

    var fileStr = "testData.JSON";

    
    // writeFile = fs.open(fileStr, 'w', function() {
    //     console.log("File opened for writing: ", fileStr)
    // });
    fs.writeFile(fileStr, JSON.stringify(allInfo), function( ) {
        console.log("File written: " + fileStr);
    });

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

