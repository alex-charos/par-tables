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

  chartJson  = {
    title: {
      text: "Outgoing transactions",
      fontSize: 16,
      fontColor: "#fff"
    },
    backgroundColor: "#2bbb9a",
    globals: {
      shadow: false,
      fontFamily: "Arial"
    },
    type: "line",
    scaleX: {
       transform: {
              type: 'date'
          },
      maxItems: 40,
      lineColor: "white",
      lineWidth: "1px",
      values : [0,2,3,4,5,100],
      tick: {
        lineColor: "white",
        lineWidth: "1px"
      },
      item: {
        fontColor: "white"
      },
      guide: {
        visible: false
      }
    },
    scaleY: {
      lineColor: "white",
      lineWidth: "1px",
      tick: {
        lineColor: "white",
        lineWidth: "1px"
      },
      guide: {
        lineStyle: "solid",
        lineColor: "#249178"
      },
      item: {
        fontColor: "white"
      },
    },
    tooltip: {
      visible: false
    },
    crosshairX: {
      lineColor: "#fff",
      scaleLabel: {
        backgroundColor: "#fff",
        fontColor: "#323232"
      },
      plotLabel: {
        backgroundColor: "#fff",
        fontColor: "#323232",
        text: "%v",
        borderColor: "transparent"
      }
    },
    plot: {
      lineWidth: "2px",
      lineColor: "#FFF",
      aspect: "spline",
      marker: {
        visible: false
      }
    },
    series: [{
      values: [0,1,2,3]
    }]
  };

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/seasons')
      .then(response => {
                
        this.pars = response.data; 
              
        var maxKey = -1;
        var maxPar = {};
        for (var key in this.pars) {
          
          if (parseInt(key) > parseInt(maxKey)) {
            maxKey = key;
            maxPar = this.pars[key];
          }
        }
        var parArr = [];
        for (var key in maxPar) {
          var parObj = {team:key, par:maxPar[key]};
          parArr.push(parObj);
        }
        
        this.lastPar = parArr;
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
