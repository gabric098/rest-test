(function () {

    'use strict';

    /**
     * Helper module to resolve complete paths based on a current one
     * @type {Module}
     */
    var path = require('path');

    /**
     * external resources and requirements
     */
    var libs = {
        router: require('../router'),
        restify: require('restify'),
        jsender : require('jsender'),
        restifyValidator : require('restify-validator'),
        nconf: require('nconf')
    };

    // load environment dependent config file
    libs.nconf.file({
        file: path.join(__dirname, '../../config', process.env.NODE_ENV + '.json')
    });

    /**
     * Private methods and vars
     */
    var internals = {

        /**
         * an instance of the http resrify server
         *
         * @private
         */
        server : null,


        /**
         * Create restify server, configure it, and start listening
         * for incoming connections
         *
         * @private
         */
        run : function() {
            internals.server = internals.createServer();
            internals.setupServer();
            internals.setEndpoints();
            internals.listen(libs.nconf.get('server:port'));
        },

        /**
         * Specifies the list of plugins used by the server
         *
         * @private
         */
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

        /**
         * Creates a restify instance properly configured and
         * returns it
         *
         * @returns {object} a restify server instance
         * @private
         */
        createServer : function() {
            var server = libs.restify.createServer({
                name: libs.nconf.get('server:name'),
                version: libs.nconf.get('server:defaultVersion'),
                acceptable: libs.nconf.get('server:acceptable')
            });

            return server;
        },

        /**
         * Enable the server to recieve incoming connections to the
         * specified port
         *
         * @private
         */
        listen : function() {
            console.log('Server up and running');
            internals.server.listen(libs.nconf.get('server:port'));
        },

        /**
         * Set the supported endpoints paths
         *
         * @private
         */
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

        /**
         * Set GET endpoints
         *
         * @private
         */
        setGETEndPoint : function (action) {
            internals.server.get('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        },

        /**
         * Set POST endpoints
         *
         * @private
         */
        setPOSTEndPoint : function (action) {
            internals.server.post('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        },

        /**
         * Set PUT endpoints
         *
         * @private
         */
        setPUTEndPoint : function (action) {
            internals.server.put('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        },

        /**
         * Set DEL endpoints
         *
         * @private
         */
        setDELEndPoint : function (action) {
            internals.server.del('/' + libs.nconf.get('app:apiVersion') + action.endPoint, action.impl);
        }

    };

    /**
     * Methods publicly exposed by internals.exports
     * @type {Object}
     */
    var api = {

        /**
         * Starts the API server.
         *
         * @returns {object} the resify instance (used for testing purpose)
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