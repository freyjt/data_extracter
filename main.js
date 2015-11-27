

function Main( ) {

    var args = process.argv;
    if(typeof(args[2]) != 'undefined') {
        modDate = args[2];
    } else {
        modDate = 'now';
    }


    var lineEnd = /\r\n/;
    var fs = require('fs');
    var i, j, a; //just an index man
    var childProcess = require('child_process');

    var baseRostStr  = 'phantomjs getRoster.js ';
    var baseGameLog  = 'phantomjs getGameLog.js ';
    var basePlyrSta  = 'phantomjs getPlayerStatus.js ';

    var espnIdArr = [];
    var playerArr = [];
    var allInfo   = {};
    var gameLogStr= baseGameLog; //script call for getGameLog.js
    var gameLog; //returned
    var gameJSON;
    //experimenting with not returning
    var errorLog = [];

    teamStr = fs.readFileSync('teamList.txt', 'utf-8');
    
    //DEBUGGING
    // teamStr = 'cle';
    
    teams   = teamStr.split(lineEnd);
    console.log("Teams being accessed: " + teams);
    for(a = 0; a < teams.length; a++) {

        teamId = teams[a]; 
        //this now lacks genrality. Later make it accept a year argument
        var rostStr      = 'phantomjs getRoster.js ' + teamId;
        console.log(rostStr);
        
        retStr = childProcess.execSync( rostStr ).toString();
        
        retStr = retStr.split(lineEnd); 
        for(i = 0; i < retStr.length; i++) {
            //test the output for some identifying features of the JSON string
            //  imperfect to say the least
            if(retStr[i][0] == '{' && retStr[i].length > 50) {

                unpacked = JSON.parse( retStr[i] );
                
                for(key in unpacked) {

                    gameLogStr = baseGameLog + key + " " + modDate;
                    console.log(gameLogStr); //Leave this one!
                    gameLog = childProcess.execSync( gameLogStr ).toString();
                    
                    gameLog = gameLog.split(/\r\n/); //WHY does lineend not work
                    
                    for(j = 0; j < gameLog.length; j++) {
                        // console.log(gameLog[j]); //debugging
                        if(gameLog[j][0] == '{' && gameLog[j].length >= 50) {
                            gameJSON = JSON.parse( gameLog[j] );
                            unpacked[key]['gameLog'] = gameJSON;
                            j = gameLog.length;
                        } else if ( gameLog[j].substr(0, 5) == "Error" ) {
                            errorLog.push("" + gameLog[j] + " : " + unpacked[key] + " : " + unpacked[key]['name']);
                            unpacked[key]['gameLog'] = "Unavailable";
                        }
                    }

                    playerStatus = basePlyrSta + key;
                    console.log(playerStatus);
                    playerStatus = childProcess.execSync( playerStatus ).toString();
    
                    playerStatus = playerStatus.split(/\r\n/);
                    for(j = 0; j < playerStatus.length; j++) {

                        if( playerStatus[j] == 'out') {
                            unpacked[key]['status'] = 'out';
                        } else if( playerStatus[j] == 'active') {
                            unpacked[key]['status'] = 'active';
                        } else if( playerStatus[j].substr(0, 5) == "Error") {
                            errorLog.push("" + gameLog[j] + " : " + unpacked[key] + " : " + unpacked[key]['name']);
                        }

                    }
                    if(typeof(unpacked[key]['status']) == 'undefined') {
                        unpacked[key]['status'] = "Unavailable";
                    }

                }

            }
        }
        console.log(unpacked);
        allInfo[teamId] = unpacked;
    }
    //**********************

    console.log( errorLog );

    var fileStr = "testData.JSON";

    fs.writeFile(fileStr, JSON.stringify(allInfo), function( ) {
        console.log("File written: " + fileStr);
    });

    function appendIdentifiers( objIn ) {
        for(key in objIn) {
            espnIdArr.push(objIn[key]['espnId']);
            playerArr.push(objIn[key]['name']);
        }
    }
}

Main( );

