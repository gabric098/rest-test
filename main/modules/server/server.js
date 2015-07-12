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
            internals.server.listen(libs.nconf.get('server:port'));
        },

        setEndpoints : function() {
            var getActions = libs.router.getGETControllerActions();
            getActions.forEach(internals.setGETEndPoint);

            var postActions = libs.router.getPOSTControllerActions();
            postActions.forEach(internals.setPOSTEndPoint);

            var putActions = libs.router.getPUTControllerActions();
            putActions.forEach(internals.setPUTEndPoint);

            var delActions = libs.router.getDELControllerActions();
            delActions.forEach(internals.setDELEndPoint);
        },

        setGETEndPoint : function (action) {
            internals.server.get('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        },

        setPOSTEndPoint : function (action) {
            internals.server.post('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        },

        setPUTEndPoint : function (action) {
            internals.server.put('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        },

        setDELEndPoint : function (action) {
            internals.server.del('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
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
            return internals.server;
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
