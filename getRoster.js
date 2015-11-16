//
//Opens an espn page for an nba player given by id as a command line argument
// and builds a set of game data, returning a JSON string to console
//
// 
function getTeamRoster( ) {

    var system   = require('system');
    var teamId   = system.args[1];

    var page = require('webpage').create();
    var url  = 'http://espn.go.com/nba/team/roster/_/name/' + teamId;

    page.open(url, function(status) {

        // var content = page.content;
        //the evaluate is where we can use some DOM js
        allGames = page.evaluate( function() {
            
            
            //abuses table classing of even and oddrows to get all games
            var oddPlayers  = document.getElementsByClassName("oddrow");
            var evenPlayers = document.getElementsByClassName("evenrow")
            var next;

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