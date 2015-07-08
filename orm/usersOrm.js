/**
 * User: Pavel 'PK' Kaminsky
 * Date: 3/29/14
 */

require('./index.js');
var Sequelize = require("sequelize");

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
});

var userORM = sequelize.define('user', {
    id: Sequelize.INTEGER,
    fbid: Sequelize.INTEGER,
    fbToken: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING
});


module.exports.findUserById = function (id, callback) {
    userORM.find({where: {id: id}}).success(function (user) {
        callback(user);
    });
}
