/**
 * User: Pavel 'PK' Kaminsky
 * Date: 3/29/14
 */

var usersOrm = require('./../orm/usersOrm.js');

exports.getUser = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.fail(errors);
        return;
    }

    usersOrm.findUserById(req.params["id"], function (user) {
        console.log(user);
        res.success(user);
    })

};

