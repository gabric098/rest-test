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
            name: req.params["name"] || "",
            worth_perc: req.params["worth_perc"] || "",
            priority: req.params["priority"] || "",
            start_date: req.params["start_date"] || "",
            end_date: req.params["end_date"] || ""
        };
    },

    makeErrorFriendly : function(reason) {
        var errUser = "Something went wrong while fulfilling your request";
        var errCode = reason || "unknown";
        return {
            description: errUser,
            code: errCode
        }
    }
};

exports.getPromotion = function (req, res) {
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

    Promotion.findPromotionById(req.params["id"], resolveCb, rejectCb);
};

//OK
exports.deletePromotion = function (req, res) {
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

    Promotion.deletePromotionById(req.params["id"], resolveCb, rejectCb);
};

exports.getActivePromotions = function (req, res) {
    res.cache([type], [options]);
    if (!internals.isRequestValidated(req, res)) {
        return;
    }

    var resolveCb = function(result) {
        if (result.length < 1) {
            res.status(404);
            res.fail({description: 'No resources found'});
        } else {
            res.success(result);
        }
    };

    var rejectCb = function(reason) {
        var error = internals.makeErrorFriendly(reason);
        res.error("Server error", error);
    };

    Promotion.findActive(resolveCb, rejectCb);
};

exports.createPromotion = function (req, res) {
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

    Promotion.createPromotion(promotion, resolveCb, rejectCb);
};

exports.updatePromotion = function (req, res) {
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

    Promotion.updatePromotion(id, promotion, resolveCb, rejectCb);
};

