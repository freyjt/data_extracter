

function Main( ) {
    //test the os and set the split string for
    //  returns
    var os = require('os');
    if(/^win/.test(os.platform))
        var lineEnd = '\r\n';
    else var lineEnd = '\n';
    var i, j; //just an index man
    var childProcess = require('child_process');
    var testID       = 'cle';

    var rostStr      = 'phantomjs getRoster.js ' + testID;
    var espnIdArr= [];
    //experimenting with not returning
    exe = childProcess.exec(rostStr, function(err, stdout, stderr) {
        if(!err) {
            stdout = stdout.split(lineEnd); // @TODO test: will this change on unix?
            for(i = 0; i < stdout.length; i++) {
                //test the output for some identifying features of the JSON string
                //  imperfect to say the least
                if(stdout[i][0] == '{' && stdout[i].length > 50) {
                    var playerArr = [];
                    // console.log(stdout[i]);
                    unpacked = JSON.parse(stdout[i]);
                    console.log(unpacked);
                    var key;
                    arrByClosure(unpacked);
                    // for( key in unpacked ) {
                    //     // @TODO figure out why this test breaks it
                    //     //if( !unpacked.hasOwnProperty(key) ) {
                    //         playerArr.push(unpacked[key]['name']);
                    //         espnIdArr.push(unpacked[key]['espnId']);
                    //     //}
                    // }

                    // for(i = 0; i < espnIdArr.length; i++) {
                    //     console.log(playerArr[i] + " : " + espnIdArr[i] );
                    // }
                    // return espnIdArr;
                }
            }
        } else {console.log("there was an error"); }
    });

//....are you going to have to spawn all of the children within the major process
    exe.on('exit', function( ) {
        console.log("Exit call.");
        console.log(espnIdArr.length);
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
    function arrByClosure( objIn ) {
        espnIdArr = [];
        for(key in objIn) {
            espnIdArr.push(objIn[key]['espnId']);
        }
    }
}

Main( );

