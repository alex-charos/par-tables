import angular from 'angular';
const ngRoute = require('angular-route');
//import zingchart from 'zingchart-angularjs';
const zingchart = require('zingchart-angularjs');
import routing from './main.routes';
import 'zingchart-angularjs';
export class MainController {
  pars = {};
  newThing = '';
  lastPar = [];
  matchDays = [];
  chartJson = {};
  series = [];
  teams = [];
  seasonId = 426;
  parMapLimit = -8
  teamsInterested = ['Leicester City FC', 'Everton FC','Tottenham Hotspur FC','Arsenal FC', 'Liverpool FC','Manchester City FC','Manchester United FC','Chelsea FC'];
  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  plotTable() {
    this.chartJson  = {
    title: {
      text: "Points to Target Comparison",
      fontSize: 16,
      fontColor: "black"
    },
    backgroundColor: "white",
    globals: {
      shadow: false,
      fontFamily: "Arial"
    },
    type: "line",
    legend: {},
    scaleX: {
      label: {text:"Match Day"},
      maxItems: 40,
      lineColor: "black",
      lineWidth: "1px",
      values : this.matchDays,
      tick: {
        lineColor: "black",
        lineWidth: "1px"
      },
      item: {
        fontColor: "black"
      },
      guide: {
        visible: false,

      }
    },
    scaleY2: {
      lineColor: "black",
      lineWidth: "1px",
        "values":"-10:7:1",

      tick: {
        lineColor: "black",
        lineWidth: "1px"
      },
      guide: {
        lineStyle: "dotted",
        lineColor: "black"
      },
      item: {
        fontColor: "black"
      },
    },
    scaleY: {
        label: {text:"Actual Points minus Target Points"},
      lineColor: "black",
      lineWidth: "1px",
        "values":"-10:7:1",

      tick: {
        lineColor: "black",
        lineWidth: "1px"
      },
      guide: {
        lineStyle: "solid",
        lineColor: "grey"
      },
      item: {
        fontColor: "black"
      },
    },
    tooltip: {
      visible: true 
    },
    plot: {
        "tooltip":{
            "text":"%t<br>%v"
        },
      lineWidth: "4px", 
      aspect: "spline",
      marker: {
        size:6,
        visible: true,
        borderColor: "transparent"
      }
    },
    series: this.series
  };
  }
 
  getTeamByName(name) {
    for (var i =0; i <this.teams.length; i++) {
        if (this.teams[i].name === name) {
            return this.teams[i];
        }
    }

    return {name:name};
  }


  $onInit() {
    this.$http.get('/api/teams')
      .then(response => {
                
        this.teams = response.data; 

        this.getPars();
      });
    
  }
  getPars() {
    this.$http.get('/api/par?seasonId='+this.seasonId)
      .then(response => {
                
        this.pars = response.data; 
        var tmpMatchDays = [0];
        var maxKey = -1;
        var maxPar = {};

        var seriesMap =  {} ;
        for (var i=0; i< this.pars.length; i++) {
            tmpMatchDays.push(parseInt(this.pars[i].matchday));
            for (var j =0; j < this.pars[i].pars.length; j++) {

              var team = this.pars[i].pars[j].team;
              var p = this.pars[i].pars[j].par;
                //if (this.teamsInterested.indexOf(team) >-1) {
                    if (seriesMap[team]=== undefined) {
                        seriesMap[team] = [0];
                    }
                    seriesMap[team].push(p);
                //}
            }
         if (parseInt(this.pars[i].matchday) > parseInt(maxKey)) {
            maxKey = this.pars[i].matchday;
            maxPar = this.pars[i];
          }
        }

        for (var team in seriesMap) {
          console.log('comparing' + seriesMap[team][seriesMap[team].length-1] + ' with ' + this.parMapLimit);
          if (seriesMap[team][seriesMap[team].length-1]  < this.parMapLimit) {
            console.log('deleting');
            delete seriesMap[team];
          }
        }
                console.log(seriesMap);


        tmpMatchDays.sort(function(a,b) {
            return a > b;
        });
        this.matchDays = tmpMatchDays;
        
        var parArr = [];
        for (var i = 0; i < maxPar.pars.length; i++) {
            var team = this.getTeamByName(maxPar.pars[i].team);
            var parObj = {team:team, par:maxPar.pars[i].par};
            parArr.push(parObj);
        }
        parArr.sort(function(a,b) {
            if (a.par === b.par) {
                return a.team.name > b.team.name;
            }
            return a.par < b.par;
        });
        var sortedPar = parArr;
        var seriesArray = [];
        for (var i =0; i < sortedPar.length; i++) {
            for (var key in seriesMap) {
                if (key === sortedPar[i].team.name) {
                    var team = this.getTeamByName(key)
                    var color = team.color;
                    seriesArray.push( 
                                    {values: seriesMap[key],
                                    text: key,
                                    "lineColor":color,
                                    "marker": {backgroundColor: color}
                                     });
                }
            }
        }


        this.lastPar = parArr;
        this.series = seriesArray;
        this.plotTable();


      });


  }
 
}

export default angular.module('parTablesApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
