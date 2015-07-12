(function () {

    'use strict';

    var path = require('path');
    var modulesDir = path.resolve(__dirname + '/../../modules');

    var libs = {
        router: require(modulesDir + '/router'),
        restify: require('restify'),
        jsender : require('jsender'),
        restifyValidator : require('restify-validator'),
        nconf: require('nconf')
    };

    libs.nconf.file({
        file: path.join(__dirname, '../../config', process.env.NODE_ENV + '.json')
    });

    var internals = {

        server : null,

        run : function() {
            internals.server = internals.createServer();
            internals.setupServer();
            internals.setEndpoints();
            internals.listen();
        },

        setupServer : function() {
            var plugins = [
                libs.restify.acceptParser(internals.server.acceptable),
                libs.restify.dateParser(),
                libs.restify.queryParser(),
                libs.restify.fullResponse(),
                libs.restify.bodyParser(),
                libs.restify.gzipResponse(),
                libs.jsender(),
                libs.restifyValidator
            ];

            internals.server.use(plugins);
        },

        createServer : function() {
            var server = libs.restify.createServer({
                name: libs.nconf.get('server:name'),
                version: libs.nconf.get('server:defaultVersion'),
                acceptable: libs.nconf.get('server:acceptable')
            });

            return server;
        },

        listen : function() {
            console.log('Server up and running');
            internals.server.listen('3000');
        },

        setEndpoints : function() {
            var getActions = libs.router.getGETControllerActions();
            getActions.forEach(internals.setGETEndPoint);

        },

        setGETEndPoint : function (action) {
            internals.server.get(action.endPoint, action.impl);
        }

    };

    var api = {

        /**
         * Starts the API server.
         *
         * @returns {void}
         *
         * @public
         */
        start : function () {
            internals.run();
        },

        /**
         * Stops the API server.
         *
         * @returns {void}
         *
         * @public
         */
        stop : function () {
            internals.server.close();
        }
    };

    module.exports = api;
})();
