//import Par from './par.model';

import Team from '../team/team.model';
import Par from '../par/par.model';
import Season from '../season/season.model';
import Fixture from '../season/fixture.model';

var http = require('http');
var Promise = require('es6-promise').Promise
  , state = {}
  ;

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
        return  Date.parse(a.kickOff) > Date.parse(b.kickOff);
    });
            

     for (var i = 0; i<fixtures.length;i++) {
        
        if (fixtures[i].homeScore !==null 
                &&  fixtures[i].awayScore!=null) {

            var p = new Promise(
                function (resolve, reject) {
                    var fixture = fixtures[i];
                    Team.find({_id:fixture.homeTeam})
                    .then(function(homeTeam) {
                        Team.find({_id:fixture.awayTeam})
                        .then(function(awayTeam) {
                        
                            fixture.homeTeam = homeTeam[0];
                            fixture.awayTeam = awayTeam[0];
                            var parPointsHome = getParPoints(fixture.awayTeam.rank, true,fixture.homeScore,fixture.awayScore);
                            var parPointsAway = getParPoints(fixture.homeTeam.rank, false,fixture.homeScore,fixture.awayScore);
                            
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
                    if (obj.pars === undefined) {
                        obj.pars = [];
                    }
                    //obj[values[i].homeTeam.name] = values[i].homePar;
                    //obj[values[i].awayTeam.name] = values[i].awayPar;
                    obj.matchday = values[i].matchday;
                    obj.pars.push({team:values[i].homeTeam.name, par: values[i].homePar});
                    obj.pars.push({team:values[i].awayTeam.name, par: values[i].awayPar});
                    parMap[values[i].matchday] = obj;
                }
                //console.log(parMap);
                var arr=[];
                for (var key in parMap) {
                    console.log('parmapkey');
                    console.log(parMap[key]);
                    arr.push(parMap[key]);
                    console.log('arrgeti');
                    console.log(arr[arr.length-1]);
                    

                }
                console.log('arr');
                console.log(arr);
                resolve(arr) ;
            });

        });
} 

function getAggregatedPar(pars) {
    
    var moreExist = true
    var aggs = {};
    var mapPars = {};
    pars.sort(function(a,b) {
        return a.matchday > b.matchday;
    });
    var prevP = pars[0];

    for (var i = 1; i < pars.length; i++) {
        for (var j =0 ; j < pars[i].pars.length; j++) {
            for (var k =0; k < prevP.pars.length; k++) {
                if (pars[i].pars[j].team === prevP.pars[k].team) {
                    pars[i].pars[j].par += prevP.pars[k].par;
                }
            }
        }
        prevP = pars[i];
    }
    
    return pars;
}

export function getPars(seasonId) {
    console.log('testsets')
    return new Promise(
        function (resolve, reject) {
                    console.log('sssssss');
                    Fixture.find({seasonId:seasonId})
                    .then(function(fixtures) {
                        console.log('sssss');
                        getParPerMatchDay(fixtures).then(function(parMap) {
                                console.log('lala');
                              //  console.log(parMap);
                                    var aggs = getAggregatedPar(parMap);
                                    console.log(aggs);
                                    resolve(aggs);
                                     
                                });

             });

        }

        );
    
}
