

/**
 * external resources and requirements
 */
var libs = {
    log4js : require('log4js'),
    nconf : require('nconf')
};

/**
 * Helper module to resolve complete paths based on a current one
 * @type {Module}
 */
var path = require('path');

// load environment dependent config file
libs.nconf.file({
    file: path.join(__dirname, '../../config', process.env.NODE_ENV + '.json')
});

(function () {

    'use strict';

    libs.log4js.configure(libs.nconf.get("log4js"));

    module.exports = libs.log4js;

})();
