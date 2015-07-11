var Sequelize = require("sequelize");
var sequelize = require('./index.js');

var Promotion = sequelize.define('promotion', {
    id: Sequelize.INTEGER,
    name: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [1, 255],
                msg: "name can't be empty or longer than 255 chars."
            }
        }
    },
    worth_perc: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: {
                args: [true],
                msg: "worth_perc must be a valid integer."
            },
            min: {
                args: [0],
                msg: "worth_perc value must be beetween 1 and 100."
            },
            max: {
                args: [100],
                msg: "worth_perc value must be beetween 1 and 100."
            }
        }
    },
    priority: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: {
                args: [true],
                msg: "priority must be a valid integer."
            },
            min: {
                args: [1],
                msg: "priority value must be beetween 1 and 10."
            },
            max: {
                args: [10],
                msg: "priority value must be beetween 1 and 10."
            }
        }
    },
    start_date: {
        type: Sequelize.DATE,
        validate: {
            isDate: {
                args: [true],
                msg: "start_date must be a valid date, use this format (2001-10-31T22:00:00.000Z)"
            }
        }
    },
    end_date: {
        type: Sequelize.DATE,
        validate: {
            isDate: {
                args: [true],
                msg: "end_date must be a valid date, use this format (2001-10-31T22:00:00.000Z)"
            }
        }
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
                    $and: {
                        start_date: {
                            $lte: endDate
                        },
                        end_date: {
                            $gte: stDate
                        }
                    }
                }
            }
        }
    }
});

Promotion.hook('beforeCreate', function(promotion, options) {
    // check if the dates are coherent (start_date < end_date)
    if (promotion.end_date <= promotion.start_date ) {
        return sequelize.Promise.reject("End date must be greater than start date");
    }

    // apply custom check:
    // - IF promotion has same name AND
    // - dates range overlaps
    // - THEN the promotion can't be inserted
    return Promotion.scope('overlap', { method: [
        'overlap',
        promotion.name,
        promotion.start_date,
        promotion.end_date
    ]} ).findAll().then(function (result) {
        if (result.length > 0) {
            return sequelize.Promise.reject("Promotion is overlapping an existing one with the same name");
        } else {
            return sequelize.Promise.resolve();
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
