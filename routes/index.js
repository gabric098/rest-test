var promotionController = require('./../controllers/promotionController.js');

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
    server.get('/promotions', promotionController.getActivePromotions);

    server.get('/promotions/:id', promotionController.getPromotion);

    server.post('/promotions', promotionController.createPromotion);

    server.del('/promotions/:id', promotionController.deletePromotion);

    server.put('/promotions/:id', promotionController.updatePromotion);

};
