//import Par from './par.model';

import {getTeamPosition} from '../season/season.rest-calls';

import Team from '../team/team.model';

var http = require('http');
var Promise = require('es6-promise').Promise
  , state = {}
  ;

var host = 'api.football-data.org';
var rootPath ='/v1/soccerseasons/';
var token = '79e23fafd923491b91572cde3c9d41e3';

var teamsStored = undefined;

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
 
function getColourByTeam(team) {
    var color = undefined;
    if (team==='Liverpool FC') {
        color = '#ff1a1a';
    }
    if (team==='Chelsea FC') {
        color = '#0033cc';
    }
    if (team==='Arsenal FC') {
        color = '#ff4d4d';
    }
    if (team==='Manchester United FC') {
        color = '#800000';
    }
    if (team==='Manchester City FC') {
        color = '#66ccff';
    }
    if (team==='Tottenham Hotspur FC') {
        color = '#000066';
    }
    if (team==='Everton FC') {
        color = '#000099';
    }
     if (team==='Leicester City FC') {
        color = '#00cc99';
    }
    return color;

}

export function getTeams(seasonId) {

    return new Promise (


           function (resolve, reject) {
                var season = {};
                get(seasonId)
                .then(function(data) {
                    var t = JSON.parse(data);
                    season = t;
                    get(seasonId+'/teams')
                    .then(function (data2) {

                        var teams = [];
                        var tt = JSON.parse(data2);

                        for (var i =0; i < tt.teams.length; i++) {
                            var color = getColourByTeam(tt.teams[i].name);
                            var pos  = getTeamPosition(tt.teams[i].name)
                            teams.push({
                                name        : tt.teams[i].name,
                                code        : tt.teams[i].code,
                                shortName   : tt.teams[i].shortName,
                                badge       : tt.teams[i].crestUrl,
                                color       : color,
                                rank        : pos
                            });
                            
                            
                               
                        }
                        console.log('retrieved teams via REST');
                        teamsStored = teams;
                        resolve(teams);
                    });
                });
            });
 
}