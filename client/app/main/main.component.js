import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {
  pars = {};
  newThing = '';
  lastPar = {};
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
        for (key in this.pars) {
          if (key > maxKey) {
            maxKey = key;
            maxPar = this.pars[key];
          }
        }
        this.lastPar = maxPar;
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
