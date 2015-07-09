var promotionController = require('./../controllers/promotionController.js');

function validateSession(req, res, next) {
    if (!req.session.fbid) {
        res.fail({response: "no session", time: Math.round(new Date().getTime() / 1000)});
    }
    else
        next();
}

module.exports.init = function (server, apiVersion) {

    server.get('/', function (req, res) {
        res.success("API IS OK");
    });

    console.log(apiVersion);

    //user
    server.get('/'+apiVersion+'/promotions', promotionController.getActivePromotions);

    server.get('/'+apiVersion+'/promotions/:id', promotionController.getPromotion);

    server.post('/'+apiVersion+'/promotions', promotionController.createPromotion);

    server.del('/'+apiVersion+'/promotions/:id', promotionController.deletePromotion);

    server.put('/'+apiVersion+'/promotions/:id', promotionController.updatePromotion);

};
