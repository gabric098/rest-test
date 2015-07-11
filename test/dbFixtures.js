var nconf = require('nconf');
var path = require('path');
var mysql = require('mysql');

// config
nconf.file({
    file: path.join(__dirname, '../main/config', process.env.NODE_ENV + '.json')
});
var connection;

var createConnection = function () {
    connection = mysql.createConnection({
        host: nconf.get('database:host'),
        user: nconf.get('database:user'),
        password : nconf.get('database:password'),
        port: nconf.get('database:port'),
        database : nconf.get('database:database')
    });
};

var destroyConnection = function () {
    connection.end();
};

var generateDateInterval = function(active) {
    var now = new Date();
    var sDate = new Date((now.getTime() - (7 * 24 * 60 * 60 * 1000))); // -7days
    var eDate = new Date((now.getTime() - (3 * 24 * 60 * 60 * 1000))); // -3days

    if (active) {
        eDate = new Date((now.getTime() + (7 * 24 * 60 * 60 * 1000))); // +7days
    }

    // set milliseconds to 0, MySQL doesn't like ms
    sDate.setMilliseconds(0);
    eDate.setMilliseconds(0);
    return {
        start_date: sDate.toJSON(),
        end_date: eDate.toJSON()
    }
}


module.exports.truncatePromotionsTable = function(){
    createConnection();

    var sql = "TRUNCATE TABLE promotions";
    connection.query(sql, function(error) {
        if (error) console.log(error);
    });

    destroyConnection();
};

module.exports.createInactivePromotion = function(){
    createConnection();

    var dates = generateDateInterval(false);

    var sql = "INSERT INTO promotions SET ?";
    var obj = {
        name: 'Active promotion 1',
        worth_perc: 51,
        priority: 7,
        start_date: dates.start_date,
        end_date: dates.end_date
    };

    var insId;
    connection.query(sql, obj, function(error, result) {
        if (error) console.log(error);

        insId = result.insertId;
    });

    destroyConnection();
    return {id: insId, dates: dates};
};

module.exports.generateDateInterval = generateDateInterval;