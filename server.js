
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
    file: path.join(__dirname, 'config', process.env.NODE_ENV + '.json')
});

// logging
var Logger = bunyan.createLogger({
    name: nconf.get('logging:name'),
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
    },
    streams: [
        { path: path.join(nconf.get('logging:dir'), process.env.NODE_ENV + '-' + nconf.get('server:name') + '.log') }
    ]
});

// start server
var server = restify.createServer({
    name: nconf.get('server:name'),
    version: nconf.get('server:defaultVersion'),
    acceptable: nconf.get('server:acceptable'),
    log: Logger
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

//Logging
server.on('after', restify.auditLogger({
    log: Logger
}));


server.listen(nconf.get('server:port'), function () {
    console.log();
    console.log('%s now listening on %s', nconf.get('app:name'), server.url);
    console.log();
});
