(function () {

    var libs = {
        promotionOrm: require('./orm'),
        promotionController: require('./controller')
    };

    var internals = {
        controller : {
            getGETActions: function () {
                return internals.prepareGETActions();
            }
        },
        /*getPOSTActions : internals.preparePOSTActions(),
        getPUTActions : internals.preparePUTActions(),
        getDELActsion: internals.prepareDELActions()*/

        prepareGETActions : function() {
            return [
                internals.listAllPromotions()
            ]
        },

        listAllPromotions : function() {
            var endPoint = "/promotions";
            var impl = libs.promotionController.getActivePromotions;

            return {
                endPoint : endPoint,
                impl: impl
            };
        }

    };

    var api = {
        getGETActions: internals.controller.getGETActions
    };

    module.exports = api;
})();
