var promotionsOrm = require('./../orm/promotionsOrm.js');

exports.getPromotion = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    promotionsOrm.findPromotionById(req.params["id"], function (promotion) {
        if (promotion.length < 1) {
            res.fail({
                name: 'Resource not found.'
            });
        } else {
            res.success(promotion);
        }
    }, function(reason) {
            res.error("Server error", reason);
        }
    )

};

