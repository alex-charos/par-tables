import {get} from '../util/rest-util';
var Promise = require('es6-promise').Promise
  , state = {}
  ;




export function getTeamPosition(teamName) {
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
                        resolve(teams);
                    });
                });
            });
 
}