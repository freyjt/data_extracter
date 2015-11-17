//
//Opens an espn page for an nba player given by id as a command line argument
// and builds a set of game data, returning a JSON string to console
//
// 
function getGameLog( ) {

    var system   = require('system');
    var playerId = system.args[1];
    var i;
    //if(! /\n*/.match(playerId) ) { console.log("ERROR 1 "); phantom.exit(); }
    var page = require('webpage').create();
    var url  = 'http://espn.go.com/nba/player/gamelog/_/id/' + playerId;
    page.onConsoleMessage = function( msg ) {
        console.log(msg);
    }
   // var rowcounter = 0; //debugging
    page.open(url, function(status) {
        // var content = page.content;
        //the evaluate is where we can use some DOM js
        allGames = page.evaluate( function() {
            //get the year from the selectlist
            //  assume first select is my select (true today)
            year = "Not found yet.";
            select = document.getElementsByClassName('tablesm')[0].childNodes;
            for(i = 0; i < select.length; i++) {
                if(select[i].hasAttribute('selected')) { 
                    var year = parseInt(select[i].innerHTML); 
                    i = select.length; 
                }
            }
            console.log(year);

            //abuses table classing of even and oddrows to get all games
            var oddGames  = document.getElementsByClassName("oddrow");
            var evenGames = document.getElementsByClassName("evenrow")
            var next;
            var dateStr, playAgainst, gameScore, timePlayed,
                fgMade, fgTried;
            var gamesObj  = {};
            for( i = 0; i < oddGames.length + evenGames.length; i++) {
                //seed it up

                if(i < oddGames.length)
                    next = oddGames[i].firstChild;
                else
                    next = evenGames[i - oddGames.length].firstChild;


                if(next.innerHTML != 'Averages' && next.innerHTML != 'Totals') {
                    ///OMG just iterate into an array, then dump the array
                    //   when you assign the json
                    //divide current row
                    dateStr     = next.innerHTML;   next = next.nextSibling;
                    // @todo - this is not gorgeous. you should be able to
                    //  do this by accessing the li, then checking if it has
                    //  an anchor in it
                    var testOpp  = next.getElementsByTagName('a')[1];
                    var testGame = next.getElementsByTagName('li')[1];
                    if(typeof(testOpp) !== 'undefined') {
                        playAgainst = testOpp.innerHTML;
                    } else if( typeof(testGame) !== 'undefined') {
                        playAgainst = testGame.innerHTML;
                    } else {
                        console.log("got an unknown");
                        playAgainst = 'unknown';
                    }


                    next        = next.nextSibling;


                    gameScore   = next.getElementsByTagName('a')[0].innerHTML;
                    next        = next.nextSibling;

                    timePlayed  = next.innerHTML;   next = next.nextSibling;
                    twoAttempt  = next.innerHTML;   next = next.nextSibling;
                    
                    twoPercent  = next.innerHTML;   next = next.nextSibling;
                    
                    fgMade      = parseInt(twoAttempt);
                    fgTried     = parseInt( (twoAttempt.substr(fgMade.toString().length + 1)) );

                    threeAttempt= next.innerHTML;

                    threeMade   = parseInt(threeAttempt);
                    threeTried  = parseInt( (threeAttempt.substr(threeMade.toString().length + 1) ) );
                    next        = next.nextSibling;

                    threePercent= next.innerHTML;   next = next.nextSibling;
                    freeAttempt = next.innerHTML;   next = next.nextSibling;
                    
                    freeMade    = parseInt(freeAttempt);
                    freeTried   = parseInt( (freeAttempt.substr(freeMade.toString().length + 1 ) ) );

                    freePercent = next.innerHTML;   next = next.nextSibling;
                    rebound     = next.innerHTML;   next = next.nextSibling;
                    assists     = next.innerHTML;   next = next.nextSibling;
                    blocks      = next.innerHTML;   next = next.nextSibling;
                    steals      = next.innerHTML;   next = next.nextSibling;
                    fouls       = next.innerHTML;   next = next.nextSibling;
                    
                    turnovers   = next.innerHTML;   next = next.nextSibling;
                    points      = next.innerHTML;   next = next.nextSibling;

                    gamesObj[dateStr] = {
                        opponent:    playAgainst,
                        score:       gameScore,
                        minutes:     timePlayed,
                        twoMade:     fgMade,
                        twoTried:    fgTried,
                        threeMade:   threeMade,
                        threeTried:  threeTried,
                        freeMade:    freeMade,
                        freeAttempt: freeTried,
                        rebounds:    rebound,
                        assists:     assists,
                        blocks:      blocks,
                        steals:      steals,
                        fouls:       fouls,
                        turnovers:   turnovers,
                        points:      points
                    }
                }
            }
            return gamesObj;
        } );
        
        gamesJSON = JSON.stringify(allGames);
        
        if(gamesJSON.length < 30) {
            console.log("Error. No data to return.");
        } else {

            console.log( gamesJSON );
        }

        phantom.exit();

    });
}

getGameLog( );