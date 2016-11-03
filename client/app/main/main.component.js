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
        "values":"-12:7:1",

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
        "values":"-12:7:1",

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
  /*
[{
      values: [0,1,2,3,23],
       "line-color":"black" 
    },{
      values: [3,4,1,44,232]
    }]
  */
  $onInit() {
    this.$http.get('/api/seasons')
      .then(response => {
                
        this.pars = response.data; 
        var tmpMatchDays = [0];
        var maxKey = -1;
        var maxPar = {};

        var seriesMap =  {} ;
        for (var key in this.pars) {
            tmpMatchDays.push(parseInt(key));
            for (var team in this.pars[key]) {
                if (this.teamsInterested.indexOf(team) >-1) {
                    if (seriesMap[team]=== undefined) {
                        seriesMap[team] = [0];
                    }
                    seriesMap[team].push(this.pars[key][team]);
                }
            }


          if (parseInt(key) > parseInt(maxKey)) {
            maxKey = key;
            maxPar = this.pars[key];
          }
        }

        tmpMatchDays.sort(function(a,b) {
            return a > b;
        });
        this.matchDays = tmpMatchDays;
        
        var parArr = [];
        for (var key in maxPar) {
          var parObj = {team:key, par:maxPar[key]};
          parArr.push(parObj);
        }
        
        var seriesArray = [];
        for (var key in seriesMap) {
            seriesArray.push( 
                            {values: seriesMap[key],
                            text: key
                             });
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
