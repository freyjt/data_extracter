

function getGameLog( ) {

    var system   = require('system');
    var playerId = system.args[1];
    console.log(playerId);
    //if(! /\n*/.match(playerId) ) { console.log("ERROR 1 "); phantom.exit(); }
    var page = require('webpage').create();
    var url  = 'http://espn.go.com/nba/player/gamelog/_/id/' + playerId;


    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };     

    page.open(url, function(status) {

        // var content = page.content;
        //the evaluate is where we can use some DOM js
        table      = page.evaluate( function() {
            date       = document.getElementsByClassName("tablesm")[0].value
            
            //abuses table classing of even and oddrows to get all games
            var oddGames  = document.getElementsByClassName("oddrow");
            var evenGames = document.getElementsByClassName("evenrow")
            var next;
            var dateStr, playAgainst, gameScore, timePlayed;
            var gamesObj  = {};
            for( i = 0; i < oddGames.length; i++) {
                //seed it up
                next = oddGames[i].firstChild;
                console.log(next.innerHTML);
                if(next.innerHTML != 'Averages') {
                    ///OMG just iterate into an array, then dump the array
                    //   when you assign the json
                    //divide current row
                    dateStr     = next.innerHTML;
                    next        = next.nextSibling;
                    // todo this breaks on heading rows
                    playAgainst = next.getElementsByTagName('a')[1].innerHTML;
                    
                    next        = next.nextSibling;
                    gameScore   = next.getElementsByTagName('a')[0].innerHTML;

                    next        = next.nextSibling;
                    timePlayed  = next.innerHTML;
                    next        = next.nextSibling;
                    
                    twoAttempt  = next.innerHTML;
                    next        = next.nextSibling;
                    twoPercent  = next.innerHTML;
                    next        = next.nextSibling;

                    fgMade      = parseInt(twoAttempt);
                    fgTried     = parseInt( (twoAttempt.substr(fgMade.toString().length + 1)) );

//where is three tried
                    threeAttempt= next.innerHTML;

                    threeMade   = parseInt(threeAttempt);
                    threeTried  = parseInt( (threeAttempt.substr(threeMade.toString().length + 1) ) );
                    console.log( threeMade + " : " + threeTried);
                    console.log(threeAttempt);
                    next        = next.nextSibling;
                    threePercent= next.innerHTML;
                    next        = next.nextSibling;

                    freeAttempt = next.innerHTML;
                    next        = next.nextSibling;


                    freePercent = next.innerHTML;
                    next        = next.nextSibling;

                    rebound     = next.innerHTML;
                    next        = next.nextSibling;
                    assists     = next.innerHTML;
                    next        = next.nextSibling;
                    blocks      = next.innerHTML;
                    next        = next.nextSibling;
                    steals      = next.innerHTML;
                    next        = next.nextSibling;
                    fouls       = next.innerHTML;
                    next        = next.nextSibling;
                    turnovers   = next.innerHTML;
                    next        = next.nextSibling;
                    points      = next.innerHTML;
                    gamesObj[dateStr] = {
                        opponent: playAgainst,
                        score:    gameScore,
                        minutes:  timePlayed,
                        twoMade:  fgMade,
                        twoTried: fgTried,

                    }

                }
            }
            console.log(date);
            return oddGames;
        } );

       // console.log(table);
        phantom.exit();

    });
}

getGameLog( );