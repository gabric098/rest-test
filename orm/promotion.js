require('./index.js');
var Sequelize = require("sequelize");

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    timezone: serverConfig.timezone
});

var Promotion = sequelize.define('promotion', {
    id: Sequelize.INTEGER,
    name: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 255]
        }
    },
    worth_perc: {
        type: Sequelize.INTEGER,
        validate: {
            min: 0,
            max: 100
        }
    },
    priority: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1,
            max: 10
        }
    },
    start_date: {
        type: Sequelize.DATE,
        isDate: true
    },
    end_date: {
        type: Sequelize.DATE,
        isDate: true
    }
}, {
    timestamps: false,
    scopes: {
        active: {
            where: {
                start_date: {
                    $lte: new Date()
                },
                end_date: {
                    $or: {
                        $gte: new Date(),
                        $eq: null
                    }
                }
            },
            order: [
                ['priority', 'ASC']
            ]
        },
        overlap: function (name, stDate, endDate) {
            return {
                where: {
                    name : {
                        $eq: name
                    },
                    $or: {
                        start_date: {
                            $between: [stDate, endDate]
                        },
                        end_date: {
                            $between: [stDate, endDate]
                        }
                    }
                }
            }
        }
    }
});


Promotion.beforeCreate(function(promotion, options) {
    console.log("beforeCreate " + promotion.name);
    Promotion.scope('overlap', { method: [
        'overlap',
        promotion.name,
        promotion.start_date,
        promotion.end_date
    ]} ).findAll().then(function (result) {
        if (result.length >= 1) {
            throw new Error("A promotions with the same name already exists and overlaps with the one you're creating")
        }
    });
});


module.exports.findPromotionById = function (id, sucCallback, errCallback) {
    Promotion.findAll({where: {id: id}})
        .then(function (result) {
            sucCallback(result);
    }, function (reason) {
            errCallback(reason);
    });
};

module.exports.createPromotion = function (promotion, sucCallback, errCallback) {
    Promotion.create(promotion)
        .then(function (result) {
            sucCallback(result);
        }, function (reason) {
            errCallback(reason);
        });
};

module.exports.updatePromotion = function (id, promotion, sucCallback, errCallback) {
    Promotion.update(promotion, {where: {id: id}})
        .then(function (result) {
            sucCallback(result);
        }, function (reason) {
            errCallback(reason);
        });
};

module.exports.deletePromotionById = function (id, sucCallback, errCallback) {
    Promotion.destroy({where: {id: id}})
        .then(function (result) {
            sucCallback(result);
        }, function (reason) {
            errCallback(reason);
        });
};

module.exports.findActive = function (sucCallback, errCallback) {
    Promotion.scope('active').findAll()
        .then(function (result) {
            sucCallback(result);
        }, function (reason) {
            errCallback(reason);
        });
};
