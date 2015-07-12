(function () {

    var libs = {
        promotionOrm: require('./orm'),
        promotionController: require('./controller')
    };

    var internals = {
        prepareGETActions : function() {
            return [
                internals.listAllPromotions(),
                internals.getPromotion()
            ]
        },

        preparePOSTActions : function() {
            return [
                internals.createPromotion()
            ]
        },

        preparePUTActions : function() {
            return [
                internals.updatePromotion()
            ]
        },

        prepareDELActions : function() {
            return [
                internals.deletePromotion()
            ]
        },

        listAllPromotions : function() {
            return {
                endPoint : "/promotions/",
                impl: libs.promotionController.getActivePromotions
            }
        },

        getPromotion : function() {
            return {
                endPoint : "/promotions/:id",
                impl: libs.promotionController.getPromotion
            }
        },

        createPromotion : function() {
            return {
                endPoint : "/promotions",
                impl: libs.promotionController.createPromotion
            }
        },

        updatePromotion : function() {
            return {
                endPoint : "/promotions/:id",
                impl: libs.promotionController.updatePromotion
            }
        },

        deletePromotion : function() {
            return {
                endPoint : "/promotions/:id",
                impl: libs.promotionController.deletePromotion
            }
        }

    };

    var api = {
        getGETActions: internals.prepareGETActions,
        getPOSTActions: internals.preparePOSTActions,
        getPUTActions: internals.preparePUTActions,
        getDELActions: internals.prepareDELActions
    };

    module.exports = api;
})();
