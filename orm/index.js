/**
 * User: Pavel 'PK' Kaminsky
 * Date: 3/28/14
 */
dbConfig = require('../config/development.json').database;
var Sequelize = require("sequelize")

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
});

