var config = {
    "app": {
        "name": "rest-test"
    },
    "server": {
        "timezone": "+02:00",
        "port": 3000,
        "name": "localhost",
        "defaultVersion": "1.0.0",
        "acceptable": [ "application/json" ]
    },
    log : {
        level: 'debug',
        filename: '../../../logs/api.log',
        outputToConsole: true,
        outputToFile: true,
        config: 'src/main/config/log4js.json'
    },
    "database" : {
        "host" : "localhost",
        "database" : "dod_dev",
        "port" : "3306",
        "user" : "root",
        "password" : "root",
        "dialect": "mysql"
    }
};

module.exports = config;
