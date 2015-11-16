

function getGameLog( ) {

    var system   = require('system');
    var playerId = system.args[1];

    //if(! /\n*/.match(playerId) ) { console.log("ERROR 1 "); phantom.exit(); }
    var page = require('webpage').create();
    var url  = 'http://espn.go.com/nba/player/gamelog/_/id/' + playerId;

    page.open(url, function(status) {

        // var content = page.content;
        //the evaluate is where we can use some DOM js
        allGames      = page.evaluate( function() {
            date       = document.getElementsByClassName("tablesm")[0].value
            
            //abuses table classing of even and oddrows to get all games
            var oddGames  = document.getElementsByClassName("oddrow");
            var evenGames = document.getElementsByClassName("evenrow")
            var next;
            var dateStr, playAgainst, gameScore, timePlayed,
                fgMade, fgTried;
            var gamesObj  = {};
            for( i = 0; i < oddGames.length; i++) {
                //seed it up
                next = oddGames[i].firstChild;

                if(next.innerHTML != 'Averages') {
                    ///OMG just iterate into an array, then dump the array
                    //   when you assign the json
                    //divide current row
                    dateStr     = next.innerHTML;   next = next.nextSibling;
                    
                    playAgainst = next.getElementsByTagName('a')[1].innerHTML;
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

        console.log( JSON.stringify(allGames) );

        phantom.exit();

    });
}

getGameLog( );