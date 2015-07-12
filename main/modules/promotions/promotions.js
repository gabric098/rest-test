(function () {

    'use strict';

    /**
     * external resources and requirements
     */
    var libs = {
        promotionOrm: require('./orm'),
        promotionController: require('./controller')
    };

    /**
     * Private methods and vars
     */
    var internals = {
        /**
         * Returns an array containing endpoints and implemenatation
         * of the GET methods
         *
         * @return {Array} a list of endpoints and implemenatation
         * @private
         */
        prepareGETActions : function() {
            return [
                internals.listAllPromotions(),
                internals.getPromotion()
            ]
        },

        /**
         * Returns an array containing endpoints and implemenatation
         * of the POST methods
         *
         * @return {Array} a list of endpoints and implemenatation
         * @private
         */
        preparePOSTActions : function() {
            return [
                internals.createPromotion()
            ]
        },

        /**
         * Returns an array containing endpoints and implemenatation
         * of the PUT methods
         *
         * @return {Array} a list of endpoints and implemenatation
         * @private
         */
        preparePUTActions : function() {
            return [
                internals.updatePromotion()
            ]
        },

        /**
         * Returns an array containing endpoints and implemenatation
         * of the DEL methods
         *
         * @return {Array} a list of endpoints and implemenatation
         * @private
         */
        prepareDELActions : function() {
            return [
                internals.deletePromotion()
            ]
        },

        /**
         * Definition of the method (endPoint and method implementation)
         *
         * @returns {{endPoint: string, impl: function}}
         * @private
         */
        listAllPromotions : function() {
            return {
                endPoint : "/promotions/",
                impl: libs.promotionController.getActivePromotions
            }
        },

        /**
         * Definition of the method (endPoint and method implementation)
         *
         * @returns {{endPoint: string, impl: function}}
         * @private
         */
        getPromotion : function() {
            return {
                endPoint : "/promotions/:id",
                impl: libs.promotionController.getPromotion
            }
        },

        /**
         * Definition of the method (endPoint and method implementation)
         *
         * @returns {{endPoint: string, impl: function}}
         * @private
         */
        createPromotion : function() {
            return {
                endPoint : "/promotions",
                impl: libs.promotionController.createPromotion
            }
        },

        /**
         * Definition of the method (endPoint and method implementation)
         *
         * @returns {{endPoint: string, impl: function}}
         * @private
         */
        updatePromotion : function() {
            return {
                endPoint : "/promotions/:id",
                impl: libs.promotionController.updatePromotion
            }
        },

        /**
         * Definition of the method (endPoint and method implementation)
         *
         * @returns {{endPoint: string, impl: function}}
         * @private
         */
        deletePromotion : function() {
            return {
                endPoint : "/promotions/:id",
                impl: libs.promotionController.deletePromotion
            }
        }

    };

    /**
     * Methods publicly exposed by internals.exports
     * @type {Object}
     */
    var api = {
        /**
         * Returns all GET endPoints for the current module
         *
         * @returns {Array}
         * @public
         */
        getGETActions: internals.prepareGETActions,

        /**
         * Returns all POST endPoints for the current module
         *
         * @returns {Array}
         * @public
         */
        getPOSTActions: internals.preparePOSTActions,

        /**
         * Returns all PUT endPoints for the current module
         *
         * @returns {Array}
         * @public
         */
        getPUTActions: internals.preparePUTActions,

        /**
         * Returns all DEL endPoints for the current module
         *
         * @returns {Array}
         * @public
         */
        getDELActions: internals.prepareDELActions
    };

    module.exports = api;
})();
