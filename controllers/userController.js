/**
 * User: Pavel 'PK' Kaminsky
 * Date: 3/29/14
 */

var promotionsOrm = require('./../orm/promotionsOrm.js');

exports.getUser = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    promotionsOrm.findPromotionById(req.params["id"], function (user) {
        console.log(user);
        res.success(user);
    })

};

