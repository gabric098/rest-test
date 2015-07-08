/**
 * User: Pavel 'PK' Kaminsky
 * Date: 2/6/14
 */

var usersController = require('./../controllers/userController.js');

function validateSession(req, res, next) {
    if (!req.session.fbid) {
        res.fail({response: "no session", time: Math.round(new Date().getTime() / 1000)});
    }
    else
        next();
}

module.exports.init = function (server) {

    server.get('/', function (req, res) {
        res.success("API IS OK");
    });

    //user
     server.get('/users/:id', usersController.getUser);

};
