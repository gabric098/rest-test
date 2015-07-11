var server = require('./server');
var nconf = require('nconf');
var path = require('path');

// config
nconf.file({
    file: path.join(__dirname, '../config', process.env.NODE_ENV + '.json')
});

server.listen(nconf.get('server:port'), function () {
    console.log();
    console.log('%s now listening on %s', nconf.get('app:name'), server.url);
    console.log();
});