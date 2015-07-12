var nconf = require('nconf');
var path = require('path');

// config
nconf.file({
    file: path.join(__dirname, '../../config', process.env.NODE_ENV + '.json')
});

var Sequelize = require("sequelize");

var sequelize = new Sequelize(nconf.get('database:database'), nconf.get('database:user'), nconf.get('database:password'), {
    host: nconf.get('database:host'),
    port: nconf.get('database:port'),
    dialect: nconf.get('database:dialect'),
    logging: console.log
});

module.exports = sequelize;

