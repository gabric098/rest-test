require('./index.js');
var Sequelize = require("sequelize");

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
});

var promotionsORM = sequelize.define('promotion', {
    id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    worth_perc: Sequelize.INTEGER,
    priority: Sequelize.INTEGER,
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE
}, {
    timestamps: false
});


module.exports.findPromotionById = function (id, sucCallback, errCallback) {
    promotionsORM.findAll({where: {id: id}})
        .then(function (promotion) {
            sucCallback(promotion);
    }, function (reason) {
            errCallback(reason);
    });
}
