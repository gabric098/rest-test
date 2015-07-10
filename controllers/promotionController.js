var Promotion = require('./../orm/promotion.js');

var internals = {
    /**
     *
     * @param req
     * @param res
     * @returns {boolean}
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
     *
     * @param req
     */
    preparePromotion : function(req) {
        // compose the promotions object
        return {
            name: req.params["name"],
            worth_perc: req.params["worth_perc"],
            priority: req.params["priority"],
            start_date: req.params["start_date"],
            end_date: req.params["end_date"]
        };
    }
};

exports.getPromotion = function (req, res) {
    if (!internals.isRequestValidated(req, res)) {
        return;
    }

    var resolveCb = function(result) {
        if (result.length < 1) {
            res.fail({description: 'Resource not found'});
        } else {
            res.success(result);
        }
    };

    var rejectCb = function(reason) {
        res.error("Server error", reason);
    };

    Promotion.findPromotionById(req.params["id"], resolveCb, rejectCb);
};

exports.deletePromotion = function (req, res) {
    if (!internals.isRequestValidated(req, res)) {
        return;
    }

    var resolveCb = function(result) {
        if (result !== 1) {
            res.fail({description: 'Resource not found.'});
        } else {
            res.success({description: 'Resource deleted.'});
        }
    };

    var rejectCb = function(reason) {
        res.error("Server error", reason);
    };

    Promotion.deletePromotionById(req.params["id"], resolveCb, rejectCb);
};

exports.getActivePromotions = function (req, res) {
    if (!internals.isRequestValidated(req, res)) {
        return;
    }

    Promotion.findActive(resolveCb, rejectCb);

    var resolveCb = function(result) {
        if (result.length < 1) {
            res.fail({description: 'Resource not found'});
        } else {
            res.success(result);
        }
    };

    var rejectCb = function(reason) {
        res.error("Server error", reason);
    };
};

exports.createPromotion = function (req, res) {
    if (!internals.isRequestValidated(req, res)) {
        return;
    }

    var resolveCb = function (result) {
        res.success("Object created");
    };
    var rejectCb =  function (reason) {
        res.error(reason);
    };

    var promotion = internals.preparePromotion(req);

    Promotion.createPromotion(promotion, resolveCb, rejectCb);
};

exports.updatePromotion = function (req, res) {
    if (!internals.isRequestValidated(req, res)) {
        return;
    }

    var resolveCb = function (result) {
        if (result[0] !== 1) {
            res.fail({description: 'Resource not found'});
        } else {
            res.success({
                name: 'Resource updated.'
            });
        }
    };

    var rejectCb =  function (reason) {
        res.error("Server error", reason);
    };

    var id = req.params["id"];
    var promotion = internals.preparePromotion(req);

    Promotion.updatePromotion(id, promotion, resolveCb, rejectCb);
};

