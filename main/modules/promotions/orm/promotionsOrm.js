(function () {

    /**
     * external resources and requirements
     */
    var libs = {
        logger: require('../../logger').getLogger('promotionsOrm.js'),
        nconf: require('nconf'),
        path: require('path'),
        Sequelize: require("sequelize")
    };

    /**
     * Private methods and vars
     */
    var internals = {
        sequelize: null,
        Promotion: null,

        /**
         * Initializes the sequelize ORM instance. It:
         * - loads the configuration file
         * - creates a Sequelize instance pointing to the current db
         * - defines the promotion model
         * - add some controls to some specific hooks
         *
         * @private
         */
        init: function () {
            if (!internals.sequelize) {
                // config
                libs.nconf.file({
                    file: libs.path.join(__dirname, '../../../config', process.env.NODE_ENV + '.json')
                });

                libs.logger.info("initialize sequelize");
                internals.sequelize = new libs.Sequelize(libs.nconf.get('database:database'), libs.nconf.get('database:user'), libs.nconf.get('database:password'), {
                    host: libs.nconf.get('database:host'),
                    port: libs.nconf.get('database:port'),
                    dialect: libs.nconf.get('database:dialect'),
                    logging: function(msg) {
                        libs.logger.info(msg);
                    }
                });

                internals.Promotion = internals.defineOrm();
                internals.Promotion.hook('beforeCreate', internals.preFlightChecks);
                internals.Promotion.hook('beforeUpdate', internals.preFlightChecks);
            }
        },

        /**
         * Create the Model definition in a declarative way:
         * - field types and validation
         * - some scopes
         *
         * @returns {Object}
         *
         * @private
         */
        defineOrm: function () {
            return internals.sequelize.define('promotion', {
                id: libs.Sequelize.INTEGER,
                name: {
                    type: libs.Sequelize.STRING,
                    validate: {
                        len: {
                            args: [1, 255],
                            msg: "name can't be empty or longer than 255 chars."
                        }
                    }
                },
                worth_perc: {
                    type: libs.Sequelize.INTEGER,
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
                    type: libs.Sequelize.INTEGER,
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
                    type: libs.Sequelize.DATE,
                    validate: {
                        isDate: {
                            args: [true],
                            msg: "start_date must be a valid date, use this format (2001-10-31T22:00:00.000Z)"
                        }
                    }
                },
                end_date: {
                    type: libs.Sequelize.DATE,
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
                            ['priority', 'DESC']
                        ]
                    },
                    overlap: function (id, name, stDate, endDate) {
                        return {
                            where: {
                                id: {
                                    $ne: id
                                },
                                name: {
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
        },

        /**
         * Before updating or creating a new promotion, let's make sure that
         * all the business rules are validated.
         *
         * @param promotion
         * @returns {Object}
         *
         * @private
         */
        preFlightChecks: function (promotion) {
            // check if the dates are coherent (start_date < end_date)
            if (promotion.end_date <= promotion.start_date) {
                return internals.sequelize.Promise.reject("End date must be greater than start date");
            }

            // apply custom check:
            // - IF promotion has same name AND
            // - dates range overlaps
            // - THEN the promotion can't be inserted
            return internals.Promotion.scope('overlap', {
                method: [
                    'overlap',
                    promotion.id,
                    promotion.name,
                    promotion.start_date,
                    promotion.end_date
                ]
            }).findAll().then(function (result) {
                if (result.length > 0) {
                    return internals.sequelize.Promise.reject("Promotion is overlapping an existing one with the same name");
                } else {
                    return internals.sequelize.Promise.resolve();
                }
            });
        }


    };

    /**
     * Methods publicly exposed by internals.exports
     * @type {Object}
     */
    var api = {

        /**
         * Returns the promotion identified by the id parameter.
         *
         * @param id the id of the promotion to retrieve
         * @param sucCallback success callback
         * @param errCallback error callback
         *
         * @public
         */
        findPromotionById: function (id, sucCallback, errCallback) {
            internals.init();
            internals.Promotion.findAll({where: {id: id}})
                .then(function (result) {
                    sucCallback(result);
                }, function (reason) {
                    errCallback(reason);
                });
        },

        /**
         * Add a new promotion.
         *
         * @param promotion the object representing the promotion to add
         * @param sucCallback success callback
         * @param errCallback error callback
         *
         * @public
         */
        createPromotion: function (promotion, sucCallback, errCallback) {
            internals.init();
            internals.Promotion.create(promotion)
                .then(function (result) {
                    sucCallback(result);
                }, function (reason) {
                    errCallback(reason);
                });
        },

        /**
         * Update an existing promotion.
         *
         * @param id the id of the promotion to update
         * @param promotion the object representing the promotion to add
         * @param sucCallback success callback
         * @param errCallback error callback
         *
         * @public
         */
        updatePromotion: function (id, promotion, sucCallback, errCallback) {
            internals.init();
            internals.Promotion.update(promotion, {
                where: {id: id},
                validate: true,
                individualHooks: true
            })
                .then(function (result) {
                    sucCallback(result);
                }, function (reason) {
                    errCallback(reason);
                });
        },

        /**
         * Removes an existing promotion.
         *
         * @param id the id of the promotion to delete
         * @param sucCallback success callback
         * @param errCallback error callback
         *
         * @public
         */
        deletePromotionById: function (id, sucCallback, errCallback) {
            internals.init();
            internals.Promotion.destroy({where: {id: id}})
                .then(function (result) {
                    sucCallback(result);
                }, function (reason) {
                    errCallback(reason);
                });
        },

        /**
         * Finds all active promotions.
         *
         * @param sucCallback success callback
         * @param errCallback error callback
         *
         * @public
         */
        findActive: function (sucCallback, errCallback) {
            internals.init();
            internals.Promotion.scope('active').findAll()
                .then(function (result) {
                    sucCallback(result);
                }, function (reason) {
                    errCallback(reason);
                });
        }
    };

    module.exports = api;
})();