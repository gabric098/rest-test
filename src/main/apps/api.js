(function () {

    var path = require('path');
    var modulesDir = path.resolve(__dirname + '/../../modules');

    var libs = {
        config: require('../../config'),
        logger: require(modulesDir + '/logger').getLogger('api.js'),
        server: require(modulesDir + '/server')
    };

    /**
    * Private methods and vars
    */
    var internals = {

        startServer: function() {
            internals.server.start();
        }

    }

})();
// defaults
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

// module dependencies.
var path = require('path'),
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


