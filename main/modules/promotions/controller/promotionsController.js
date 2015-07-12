(function () {

    /**
     * external resources and requirements
     */
    var libs = {
        logger: require('../../logger').getLogger('promotionsController.js'),
        promotionsOrm: require('../orm')
    };

    /**
     * Private methods and vars
     */
    var internals = {

        /**
         * Checks if the current request is valid
         *
         * @param req
         * @param res
         *
         * @returns {boolean}
         *
         * @private
         */
        isRequestValidated : function(req, res) {
            var errors = req.validationErrors();

            if (errors) {
                res.fail(errors);
                return false;
            }
            return true;
        },

        /**
         * Reads the incoming POST parameters and builds an object
         * representing a promotion
         *
         * @param req
         *
         * @returns {Object}
         *
         * @private
         */
        preparePromotion : function(req) {
            // compose the promotions object
            return {
                name: req.params["name"] || "",
                worth_perc: req.params["worth_perc"] || "",
                priority: req.params["priority"] || "",
                start_date: req.params["start_date"] || "",
                end_date: req.params["end_date"] || ""
            };
        },

        /**
         * In case of error, returns a friendly message to be returned to the user,
         * and a detailed error description for internal debug.
         *
         * @param reason
         *
         * @returns {Object}
         *
         * @private
         */
        makeErrorFriendly : function(reason) {
            var errUser = "Something went wrong while fulfilling your request";
            var errCode = reason || "unknown";
            return {
                description: errUser,
                code: errCode
            }
        },

        /**
         * Invokes the findActive method on the ORM and passes to it
         * the promise callback functions
         *
         * @param req
         * @param res
         *
         * @private
         */
        getActivePromotions: function (req, res) {
            libs.logger.info("getActivePromotions invoked");
            if (!internals.isRequestValidated(req, res)) {
                return;
            }

            var resolveCb = function (result) {
                if (result.length < 1) {
                    res.status(404);
                    res.fail({description: 'No resources found'});
                } else {
                    res.success(result);
                }
            };

            var rejectCb = function (reason) {
                var error = internals.makeErrorFriendly(reason);
                res.error("Server error", error);
            };

            libs.promotionsOrm.findActive(resolveCb, rejectCb);
        },

        /**
         * Invokes the findPromotionById method on the ORM and passes to it
         * the promise callback functions
         *
         * @param req
         * @param res
         *
         * @private
         */
        getPromotion : function (req, res) {
            libs.logger.info("getPromotion invoked");
            if (!internals.isRequestValidated(req, res)) {
                return;
            }

            var resolveCb = function(result) {
                if (result.length < 1) {
                    res.status(404);
                    res.fail({description: 'Resource not found'});
                } else {
                    res.success(result);
                }
            };

            var rejectCb = function(reason) {
                var error = internals.makeErrorFriendly(reason);
                res.error("Server error", error);
            };

            libs.promotionsOrm.findPromotionById(req.params["id"], resolveCb, rejectCb);
        },


        /**
         * Invokes the deletePromotionById method on the ORM and passes to it
         * the promise callback functions
         *
         * @param req
         * @param res
         *
         * @private
         */
        deletePromotion: function (req, res) {
            libs.logger.info("deletePromotion invoked");
            if (!internals.isRequestValidated(req, res)) {
                return;
            }

            var resolveCb = function(result) {
                if (result !== 1) {
                    res.status(404);
                    res.fail({description: 'Resource not found.'});
                } else {
                    res.success({description: 'Resource deleted.'});
                }
            };

            var rejectCb = function(reason) {
                var error = internals.makeErrorFriendly(reason);
                res.error("Server error", error);
            };

            libs.promotionsOrm.deletePromotionById(req.params["id"], resolveCb, rejectCb);
        },

        /**
         * Invokes the createPromotion method on the ORM and passes to it
         * the promise callback functions
         *
         * @param req
         * @param res
         *
         * @private
         */
        createPromotion: function (req, res) {
            libs.logger.info("createPromotion invoked");
            if (!internals.isRequestValidated(req, res)) {
                return;
            }

            var resolveCb = function (result) {
                res.success("Object created");
            };
            var rejectCb = function(reason) {
                var error = internals.makeErrorFriendly(reason);
                res.error("Server error", error);
            };

            var promotion = internals.preparePromotion(req);

            libs.promotionsOrm.createPromotion(promotion, resolveCb, rejectCb);
        },

        /**
         * Invokes the updatePromotion method on the ORM and passes to it
         * the promise callback functions
         *
         * @param req
         * @param res
         *
         * @private
         */
        updatePromotion: function (req, res) {
            libs.logger.info("updatePromotion invoked");

            if (!internals.isRequestValidated(req, res)) {
                return;
            }

            var resolveCb = function (result) {
                if (result[0] !== 1) {
                    res.status(404);
                    res.fail({description: 'Resource found'});
                } else {
                    res.success({
                        name: 'Resource updated.'
                    });
                }
            };

            var rejectCb = function(reason) {
                var error = internals.makeErrorFriendly(reason);
                res.error("Server error", error);
            };

            var id = req.params["id"];
            var promotion = internals.preparePromotion(req);

            libs.promotionsOrm.updatePromotion(id, promotion, resolveCb, rejectCb);
        }
    };

    /**
     * Methods publicly exposed by internals.exports
     * @type {Object}
     */
    var api = {
        /**
         * Returns the list of active promotions
         *
         * @public
         */
        getActivePromotions : internals.getActivePromotions,

        /**
         * Returns the promotion identified by an id
         *
         * @public
         */
        getPromotion : internals.getPromotion,

        /**
         * Created a new promotion
         *
         * @public
         */
        createPromotion : internals.createPromotion,

        /**
         * Update an existing promotion
         *
         * @public
         */
        updatePromotion : internals.updatePromotion,

        /**
         * Delete a promotion
         *
         * @public
         */
        deletePromotion : internals.deletePromotion
    };

    module.exports = api;
})();