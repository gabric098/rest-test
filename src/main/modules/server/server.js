(function () {

    var path = require('path');
    var modulesDir = path.resolve(__dirname + '/../../modules');

    /**
     * external resources and requirements
     */
    var libs = {
        restify: require('restify'),
        config: require('../../config'),
        logger: require(modulesDir + '/logger').getLogger('server.js')
    };

    var internals = {

        createServer: function () {
            var server = libs.restify.createServer({
                name: libs.config.server.name,
                version: libs.config.server.defaultVersion
            });
            server.use(libs.restify.acceptParser(libs.config.server.acceptable));
            server.use(libs.restify.dateParser());
            server.use(libs.restify.queryParser());
            server.use(libs.restify.fullResponse());
            server.use(libs.restify.bodyParser());
            server.use(libs.restify.gzipResponse());

            server.use(internals.handleCORS);
            //server.pre(libs.restify.pre.sanitizePath());
            server.use(libs.restify.queryParser());
            server.use(libs.restify.jsonBodyParser({ mapParams: false }));
            return server;
        },

        };


    module.exports = api;

})();


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
routes.init(server);

//Logging
server.on('after', restify.auditLogger({
    log: Logger
}));


server.listen(nconf.get('server:port'), function () {
    console.log();
    console.log('%s now listening on %s', nconf.get('app:name'), server.url);
    console.log();
});