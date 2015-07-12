(function () {

    'use strict';

    /**
     * Helper module to resolve complete paths based on a current one
     * @type {Module}
     */
    var path = require('path');

    /**
     * Complete path to the modules folder inside this repo
     * @type {String}
     */
    var modulesDir = path.resolve(__dirname + '/../../modules');

    /**
     * external resources and requirements
     */
    var libs = {
        server: require(modulesDir + '/server')
    };

    /**
     * Private methods and vars
     */
    var internals = {

        /**
         * List of services used by the api (just the restify service)
         */
        services: {
            server: libs.server
        },

        /**
         * This function starts the restify server
         *
         * @return {}
         */
        startService: function() {
            internals.services.server.start();
        }

    };

    // let's bootstrap the server from here
    internals.startService();

})();