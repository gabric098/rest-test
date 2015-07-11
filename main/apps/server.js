
// defaults
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

// module dependencies.
var nconf = require('nconf'),
    path = require('path'),
    restify = require('restify'),
    bunyan = require('bunyan'),
    jsender = require('jsender'),
    routes = require('./routes'),
    restifyValidator = require('restify-validator');


// config
nconf.file({
    file: path.join(__dirname, '../config', process.env.NODE_ENV + '.json')
});

// start server
var server = restify.createServer({
    name: nconf.get('server:name'),
    version: nconf.get('server:defaultVersion'),
    acceptable: nconf.get('server:acceptable')
});

var plugins = [
    restify.acceptParser(server.acceptable),
    restify.dateParser(),
    restify.queryParser(),
    restify.fullResponse(),
    restify.bodyParser(),
    restify.gzipResponse(),
    jsender(),
    restifyValidator
    ];


server.use(plugins);

//Routes
routes.init(server, nconf.get('app:apiVersion'));

server.listen(nconf.get('server:port'), function () {
    console.log();
    console.log('%s now listening on %s', nconf.get('app:name'), server.url);
    console.log();
});
