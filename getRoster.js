//`
//Opens an espn page for an nba player given by id as a command line argument
// and builds a set of game data, returning a JSON string to console
//
// 
function getTeamRoster(teamId) {

//    var system   = require('system');
//    var teamId   = system.args[1];
//    if(teamId.length === 0) {
//      console.log("WTF NO ARGS?!");
//      system.exit();
//    }
    var page = require('webpage').create();
    var url  = 'http://espn.go.com/nba/team/roster/_/name/' + teamId;
    
    // page.onConsoleMessage = function(msg) {
    //     console.log(msg);
    // }
    page.open(url, function(status) {

        // var content = page.content;
        //the evaluate is where we can use some DOM js
        allGames = page.evaluate( function() {
            
            
            //abuses table classing of even and oddrows to get all games
            var oddPlayers  = document.getElementsByClassName("oddrow");
            var evenPlayers = document.getElementsByClassName("evenrow");
            var next;

            var playerObject  = {};

            var idRegex = /\d+/;
            for( i = 0; i < oddPlayers.length + evenPlayers.length; i++) {
                //seed it up
                if(i < oddPlayers.length)
                    next = oddPlayers[i].firstChild;
                else
                    next = evenPlayers[i - oddPlayers.length].firstChild;

                if(next.innerHTML != 'Averages' && next.innerHTML != 'Totals') {

                    var jersey   = next.innerHTML;  next = next.nextSibling;
                    //extract espnId AND playername from anchor tag
                    var anchor   = next.getElementsByTagName('a')[0];
                    var href     = anchor.href;
                    var espnId   = href.match(idRegex);
                    var name     = anchor.innerHTML;
                    
                    next = next.nextSibling;

                    var pos      = next.innerHTML;  next = next.nextSibling;
                    var age      = next.innerHTML;  next = next.nextSibling;
                    var heightStr= next.innerHTML;  next = next.nextSibling;
                    //convert height to decimal for easier comparison later
                    var hFeet    = parseInt(heightStr);
                    var hInches  = parseInt( heightStr.substr(hFeet.toString().length + 1) );
                    hFeet = hFeet + (hInches / 12);
                    hFeet  = hFeet.toFixed(2);

                    var weight   = next.innerHTML;  next = next.nextSibling;
                    var college  = next.innerHTML;  next = next.nextSibling;
                    var salary   = next.innerHTML;  next = next.nextSibling;

                    if(next) { console.log("more data?"); }
                    

                    playerObject[espnId[0]] = {
                        name:     name,
                        jersey:   jersey,
                        position: pos,
                        age:      age,
                        height:   hFeet,
                        weight:   weight,
                        college:  college,
                        salary:   salary
                    };

                    
                }
            }
            return playerObject;
        } );

        console.log( JSON.stringify(allGames) );

        phantom.exit();

    });
}


var system   = require('system');
var teamId   = system.args[1];

if(teamId.length === 0) {
  console.log("WTF NO ARGS?!");
  system.exit();
} 

getTeamRoster(teamId);
