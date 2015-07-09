var Promotion = require('./../orm/promotion.js');

exports.getPromotion = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    Promotion.findPromotionById(req.params["id"], function (result) {
        if (result.length < 1) {
            res.fail({
                name: 'Resource not found.'
            });
        } else {
            res.success(result);
        }
    }, function(reason) {
            res.error("Server error", reason);
        }
    )

};

exports.deletePromotion = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    Promotion.deletePromotionById(req.params["id"], function (deletedNo) {
            if (deletedNo !== 1) {
                res.fail({
                    name: 'Resource not found.'
                });
            } else {
                res.success({
                    name: 'Resource deleted.'
                });
            }
        }, function(reason) {
            res.error("Server error", reason);
        }
    )

};

exports.getActivePromotions = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    Promotion.findActive(function (result) {
            if (result.length < 1) {
                res.fail({
                    name: 'Resource not found.'
                });
            } else {
                res.success(result);
            }
        }, function(reason) {
            res.error("Server error", reason);
        }
    )

};

exports.createPromotion = function (req, res) {
    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    var name = req.params["name"];
    var worth_perc = req.params["worth_perc"];
    var priority = req.params["priority"];
    var start_date = req.params["start_date"];
    var end_date = req.params["end_date"];

    // compose the promotions object
    var promotion = {
        name: name,
        worth_perc: worth_perc,
        priority: priority,
        start_date: start_date,
        end_date: end_date
    };

    Promotion.createPromotion(promotion, function (result) {
            res.success(result);
        }, function(reason) {
            res.error("Server error", reason);
        }
    );
};

exports.updatePromotion = function (req, res) {
    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    var id = req.params["id"];
    var name = req.params["name"];
    var worth_perc = req.params["worth_perc"];
    var priority = req.params["priority"];
    var start_date = req.params["start_date"];
    var end_date = req.params["end_date"];

    // compose the promotions object
    var promotion = {
        name: name,
        worth_perc: worth_perc,
        priority: priority,
        start_date: start_date,
        end_date: end_date
    };

    Promotion.updatePromotion(id, promotion, function (result) {
            console.log(result);
            if (result[0] !== 1) {
                res.fail({
                    name: 'Resource not found.'
                });
            } else {
                res.success({
                    name: 'Resource updated.'
                });
            }
        }, function(reason) {
            res.error("Server error", reason);
        }
    );
};

