
/*
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

}*/