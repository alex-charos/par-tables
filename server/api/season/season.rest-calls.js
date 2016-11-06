//import Par from './par.model';

import Team from '../team/team.model';

var http = require('http');
var Promise = require('es6-promise').Promise
  , state = {}
  ;

var host = 'api.football-data.org';
var rootPath ='/v1/soccerseasons/';
var token = '79e23fafd923491b91572cde3c9d41e3';

var parsStored = undefined;

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



function getParPoints(position, atHome,homeScore,awayScore) {
    
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
    var promiseArr = [];
   
    fixtures.sort(function(a,b) {
        return  Date.parse(a.date) > Date.parse(b.date);
    });
    for (var i = 0; i<fixtures.length;i++) {
        
        if (fixtures[i].result.goalsHomeTeam !==null 
                &&  fixtures[i].result.goalsAwayTeam!==null) {
            var p = new Promise(
                function (resolve, reject) {
                    var fixture = fixtures[i];
                    Team.find({name:fixture.homeTeamName})
                    .then(function(homeTeam) {
                        Team.find({name:fixture.awayTeamName})
                        .then(function(awayTeam) {
                            fixture.homeTeam = homeTeam[0];
                            fixture.awayTeam = awayTeam[0];
                            var parPointsHome = getParPoints(fixture.awayTeam.rank, true,fixture.result.goalsHomeTeam,fixture.result.goalsAwayTeam);
                            var parPointsAway = getParPoints(fixture.homeTeam.rank, false,fixture.result.goalsHomeTeam,fixture.result.goalsAwayTeam);
                            
                            var obj = {};
                            obj.homeTeam = fixture.homeTeam;
                            obj.awayTeam = fixture.awayTeam;
                            obj.homePar = parPointsHome;
                            obj.awayPar = parPointsAway;
                            obj.matchday = fixture.matchday;
                            resolve(obj);
                        });
                    });
                }
            );
            promiseArr.push(p);
        }
    }

return new Promise( 
    function (resolve, reject) {
        Promise.all(promiseArr).then(values => { 
            var parMap ={};
            for (var i =0; i < values.length; i++) {
                if (parMap[values[i].matchday]=== undefined) {
                    parMap[values[i].matchday] = {};
                }
                var obj =  parMap[values[i].matchday];
                obj[values[i].homeTeam.name] = values[i].homePar;
                obj[values[i].awayTeam.name] = values[i].awayPar;
                parMap[values[i].matchday] = obj;
            }
            resolve(parMap) ;
        });

    });
} 

function getAggregatedPar(pars) {
    var moreExist = true
    var aggs = {};
    for (var i=1; moreExist===true; i++) {
        if (pars[i]=== undefined) {
            moreExist = false;
        } else {

            for (var team in pars[i]) {
                var prev = 0;
                if (aggs[i-1] !== undefined && aggs[i-1][team] !== undefined) {
                    prev = aggs[i-1][team]
                }
                var curr = pars[i][team];
                curr = curr + prev;
                if (aggs[i]=== undefined) {
                    aggs[i] = {};
                }
                var aggCurr = aggs[i];
                aggCurr[team] = curr;
                aggs[i] = aggCurr;
            }
        }
    }

    return aggs;

}

export function getSeason(seasonId) {
        return new Promise (
                function (resolve, reject) {
                    var season = {};
                    get(seasonId)
                    .then(function(data) {
                        var t = JSON.parse(data);
                        season = t;
                        
                        get(seasonId+'/fixtures')
                        .then(function (data2) {
                            

                            var tt = JSON.parse(data2);

                            getParPerMatchDay(tt.fixtures).then(function(parMap) {
                                    var aggs = getAggregatedPar(parMap)
                                    resolve(aggs);
                                     
                                });
                           
                        });
                    });
                });
  
}