(function () {

    'use strict';

    var path = require('path');

    var modulesDir = path.resolve(__dirname + '/../../modules');
    console.log(modulesDir);

    var libs = {
        server: require(modulesDir + '/server')
    };

    var internals = {
        services: {
            server: libs.server
        },

        startService: function() {

            // start restify server
            console.log(internals.services.server);
            internals.services.server.start();
        }

    };

    internals.startService();

})();