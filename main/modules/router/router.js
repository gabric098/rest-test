(function () {

    'use strict';

    /**
     * external resources and requirements
     */
    var libs = {
        promotions: require('../promotions')
    };

    /**
     * Methods publicly exposed by internals.exports
     * @type {Object}
     */
    var api = {

        /**
         * Returns the list of GET actions implemented by controller
         *
         * @return {Array} Array of endpoints and actions defined in the controller
         *
         * @public
         */
        getGETControllerActions: function() {
            return libs.promotions.getGETActions();
        },
        /**
         * Returns the list of POST actions implemented by controller
         *
         * @return {Array} Array of endpoints and actions defined in the controller
         *
         * @public
         */
        getPOSTControllerActions: function() {
            return libs.promotions.getPOSTActions();
        },
        /**
         * Returns the list of PUT actions implemented by controller
         *
         * @return {Array} Array of endpoints and actions defined in the controller
         *
         * @public
         */
        getPUTControllerActions: function() {
            return libs.promotions.getPUTActions();
        },
        /**
         * Returns the list of DEL actions implemented by controller
         *
         * @return {Array} Array of endpoints and actions defined in the controller
         *
         * @public
         */
        getDELControllerActions: function() {
            return libs.promotions.getDELActions();
        }
    };

    module.exports = api;
})();
