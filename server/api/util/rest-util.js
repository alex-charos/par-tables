//import Par from './par.model';


var http = require('http');


var host = 'api.football-data.org';
var rootPath ='/v1/soccerseasons/';
var token = process.env.F_DATA_API_KEY;


export function get(path) {
     
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