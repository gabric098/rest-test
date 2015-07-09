/**
 * Exposes a logger.
 * @module logger/logger
 */

var log4js = require('log4js');
var config = require('../../config');

(function () {

    'use strict';

    log4js.configure(config.log.config, { reloadSecs: 10 });

    module.exports = log4js;

})();