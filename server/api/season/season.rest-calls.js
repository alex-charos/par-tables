//import Par from './par.model';

import Team from '../team/team.model';
import Par from '../par/par.model';
import Season from '../season/season.model';
import Fixture from '../season/fixture.model';

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



function updateFixtures(fixtures, seasonId) {
    try{


    fixtures.forEach(function (fixt) {
        var id = fixt._links.self.href;
        Team.find({name:fixt.homeTeamName})
                    .then(function(homeTeam) {
                        Team.find({name:fixt.awayTeamName})
                        .then(function(awayTeam) {
                            Fixture.findOneAndUpdate(
                                                    {'fixtureId' : id},
                                                    {   fixtureId:id,
                                                        kickOff: fixt.date,
                                                        homeTeam: homeTeam[0]._id,
                                                        awayTeam: awayTeam[0]._id,
                                                        homeScore: fixt.result.goalsHomeTeam,
                                                        awayScore: fixt.result.goalsAwayTeam,
                                                        seasonId: seasonId,
                                                        matchday: fixt.matchday
                                                        },
                                                        {upsert: true},
                                                        function(err, doc) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                        }
                                                );
                        });
                    });
         

    });
} catch (Error) {
        console.log(Error);
    }
}

export function getSeason(seasonId) {
        return new Promise (
                function (resolve, reject) {
                    
                    get(seasonId)
                    .then(function(data) {
                        var t = JSON.parse(data);
                        get(seasonId+'/fixtures')
                        .then(function (data2) {

                            var tt = JSON.parse(data2);
                            updateFixtures(tt.fixtures,seasonId);
                           
                        });
                    });
                });
  
}