//logs either out or active depending on the associated player status
function getPlayerStatus( playerId ) {

    //make sure you deal with typechecking on playerId in main ;)
    var url  = "http://espn.go.com/nba/player/_/id/" + playerId;
    var page = require('webpage').create();
console.log(url);
    page.open( url, function(status) {
        if(status == 'fail')
            console.log("Error, could not collect status on player: " + playerId + ". Webpage unavailable.");
        else {
            status = page.evaluate( function( ) {

                stat = document.getElementById('player-status-main');
                // return stat.toString();
                if(stat !== null) {
                    return 'out';
                } else {
                    return 'active';
                }
            });
            console.log(status);
        }
        phantom.exit();
    });
}

function main( ) {

    var system   = require('system');
    console.log(system.args[1]);
    playerId     = parseInt(system.args[1]);

    getPlayerStatus( playerId );
}
main();