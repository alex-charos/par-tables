//import Par from './par.model';


var http = require('http');
var Promise = require('es6-promise').Promise
  , state = {}
  ;

var host = 'api.football-data.org';
var rootPath ='/v1/soccerseasons/';
var token = '79e23fafd923491b91572cde3c9d41e3';



function get(path) {
     
    return new Promise(
        function (resolve, reject) {
            var options = {
                host: host,
                path: rootPath + path,
                method: 'GET',
                headers: {'X-AUTH-TOKEN': token}
            };

            http.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                var d='';
                res.on('data', function (chunk) {
                    d+=chunk;
                });
                res.on('end', function () {
                     resolve(d);
                });
            }).end();
        });

}



function getTeamPosition(teamName) {
    var tp = {
        'Hull City FC'              :20,
        'Leicester City FC'         : 1,
        'Southampton FC'            : 6,
        'Watford FC'                :13,
        'Middlesbrough FC'          :18,
        'Stoke City FC'             : 9,
        'Everton FC'                :11,
        'Tottenham Hotspur FC'      : 3,
        'Crystal Palace FC'         :15,
        'West Bromwich Albion FC'   :14,
        'Burnley FC'                :19,
        'Swansea City FC'           :12,
        'Manchester City FC'        : 4,
        'Sunderland AFC'            :17,
        'AFC Bournemouth'           :16,
        'Manchester United FC'      : 5,
        'Arsenal FC'                : 2,
        'Liverpool FC'              : 8,
        'Chelsea FC'                :10,
        'West Ham United FC'        : 7

    };

    return tp[teamName];
}

function getParPoints(teamName, atHome,homeScore,awayScore) {
    var position = getTeamPosition(teamName);
    var parPoints = 0;
    if (atHome) {
        if (homeScore > awayScore) {
            parPoints = 0;
        }
        if (homeScore < awayScore) {
            parPoints = -3;
        }
        if (homeScore === awayScore) {
            parPoints = -2;
        }
    } else {
        if (homeScore < awayScore) {
            if (position >=14) {
                parPoints = 0;
            } else {
                parPoints = 2;
            }
        }
        if (homeScore > awayScore) {
            if (position >=14) {
                parPoints = -3;
            } else {
                parPoints = -1;
            }
        }
        if (homeScore === awayScore) {
            if (position >=14) {
                parPoints = -2;
            } else {
                parPoints = 0;
            }
        }
    }
    return parPoints;
}

function getParPerMatchDay(fixtures) {
    var parMap ={};
    fixtures.sort(function(a,b) {
        return  Date.parse(a.date) > Date.parse(b.date);
    });
    for (var i = 0; i<fixtures.length;i++) {
        var fixture = fixtures[i];
        if (fixture.status ==="FINISHED") {
            console.log(fixture.homeTeamName + ' vs ' + fixture.awayTeamName +' @ ' + fixture.date );
            console.log(fixture.result.goalsHomeTeam + ' : ' + fixture.result.goalsAwayTeam);
            var parPointsHome = getParPoints(fixture.awayTeamName, true,fixture.result.goalsHomeTeam,fixture.result.goalsAwayTeam);
            var parPointsAway = getParPoints(fixture.homeTeamName, false,fixture.result.goalsHomeTeam,fixture.result.goalsAwayTeam);
            if (parMap[fixture.matchday]=== undefined) {
                parMap[fixture.matchday] = {};
            }
            var obj =  parMap[fixture.matchday];
            obj[fixture.homeTeamName] = parPointsHome;
            obj[fixture.awayTeamName] = parPointsAway;
            parMap[fixture.matchday] = obj;
        }
    }

    return parMap;
}

export function getSeason(seasonId) {
   
    return new Promise (
            function (resolve, reject) {
                var season = {};
                get(seasonId)
                .then(function(data) {
                    var t = JSON.parse(data);
                    season = t;
                    console.log(season);
                    get(seasonId+'/fixtures')
                    .then(function (data2) {
                        

                        var tt = JSON.parse(data2);

                        var parMap = getParPerMatchDay(tt.fixtures);
                        resolve(parMap);
                    });
                });
            });
}