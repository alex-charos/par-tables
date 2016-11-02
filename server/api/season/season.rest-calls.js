//import Par from './par.model';


var http = require('http');
var Promise = require('es6-promise').Promise
  , state = {}
  ;

var rootPath ='/v1/soccerseasons/'
function get(path) {
     
    return new Promise(
        function (resolve, reject) {
            var options = {
                host: 'api.football-data.org',
                path: rootPath + path,
                method: 'GET',
                headers: {'X-AUTH-TOKEN': '79e23fafd923491b91572cde3c9d41e3'}
            };

            http.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                var d='';
                res.on('data', function (chunk) {
                    //console.log('BODY: ' + chunk);
                    // resolve(chunk);
                    d+=chunk;
                });
                res.on('end', function () {
                    //console.log('BODY: ' + chunk);
                     resolve(d);
                });
            }).end();

             


           
        });

}

export function getSeason(seasonId) {
   
    return new Promise (
            function (resolve, reject) {
                var season = {};
                get(seasonId)
                .then(function(data) {
                    var t = JSON.parse(data);
                    season = t;
                    console.log(season);
                    get(seasonId+'/fixtures')
                    .then(function (data2) {
                       
                        var tt = JSON.parse(data2);
                        console.log('2');
                        for (var i = 0; i<tt.fixtures.length;i++) {
                            console.log(i);

                        }
                        resolve(tt);
                    });
                });
            });
}