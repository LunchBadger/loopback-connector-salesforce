'use strict';

var Connector = require('loopback-connector').Connector;
var jsforce = require('jsforce');
var S = require('string');

function SalesforceConnector(settings, dataSource) {
    var self = this;

    self.username = settings.username;
    self.password = settings.password;
    self.debug = settings.debug || false;
    self.dataSource = dataSource;

    self._models = {};

    if (self.debug) {
        console.log(settings);
    }
}

exports.initialize = function initializeDataSource(dataSource, callback) {
    var settings = dataSource.settings;

    dataSource.connector = new SalesforceConnector(settings, dataSource);

    if (callback) {
        if (settings.lazyConnect) {
            process.nextTick(function () {
                callback();
            });
        } else {
            dataSource.connector.connect(callback);
        }
    }
};

require('util').inherits(SalesforceConnector, Connector);

SalesforceConnector.prototype.connect = function (callback) {
    var self = this;
    if (self.db) {
        process.nextTick(function () {
            if (callback) {
                callback(null, self.db);
            }
        });
    } else if (self.dataSource.connecting) {
        self.dataSource.once('connected', function () {
            process.nextTick(function () {
                if (callback) {
                    callback(null, self.db);
                }
            });
        });
    } else {
        var conn = new jsforce.Connection();
        conn.login(self.username, self.password, function (err, res) {
            if (err) {
                console.error('Error establishing Salesforce connection', err);
                callback(err, null);
            }
            if (self.debug) {
                console.log('Salesforce connection has been established', res);
            }
            self.db = conn;
            callback(null, conn);
        });
    }
};

SalesforceConnector.prototype.disconnect = function (callback) {
    if (this.debug) {
        console.log('Disconnecting from Salesforce');
    }
    if (this.db) {
        this.db.logout(function (err) {
            if (err) {
                console.error('Error logging out of Salesforce', err);
            }
        });
    }
    if (callback) {
        process.nextTick(callback);
    }
};

SalesforceConnector.prototype.objectName = function (model) {
    var modelClass = this._models[model];
    model = modelClass.settings.salesforceObject || model;
    return model;
};

SalesforceConnector.prototype.baseQuery = function (model) {
    var template = 'SELECT {{fields}} FROM {{objectName}}';
    var modelClass = this._models[model];
    var fields = [];
    var props = modelClass.properties;

    props.forEach(function (prop) {
        fields.push(prop);
    });

    var objectName = this.objectName(model);
    var query = S(template).template({
        fields: fields.join(', '),
        objectName: objectName
    }).s;
    return query;
};

SalesforceConnector.prototype.all = function (model, filter, callback) {
    var query = this.baseQuery(model);
    var where = null;

    if (filter.where) {
        where = this.buildWhere(filter.where);
        query += ' WHERE ' + where;
    }

    //Do pagination
    this.db.query(query, function (err, result) {
        if (err) {
            console.error('Error executing query', query, err);
        }
        callback(err, result);
    });

    console.log('MODEL: ', model, '\nFILTER: ', filter, '\nCALLBACK: ', callback, '\nQUERY: ', query);
    callback('Not yet implemented', null);
};

SalesforceConnector.prototype.create = function (model, data, callback) {
    console.log('MODEL: ', model, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
};

SalesforceConnector.prototype.updateOrCreate = function (model, data, callback) {
    console.log('MODEL: ', model, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
};

SalesforceConnector.prototype.updateAttributes = function (model, id, data, callback) {
    console.log('MODEL: ', model, '\nID: ', id, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
};

SalesforceConnector.prototype.destroyAll = function (model, where, callback) {
    console.log('MODEL: ', model, '\nWHERE: ', where, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
};

SalesforceConnector.prototype.update = function (model, where, data, callback) {
    console.log('MODEL: ', model, '\nWHERE: ', where, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
};

SalesforceConnector.prototype.ping = function (callback) {
    this.db.identity(function (err, res) {
        if (err) {
            console.error(err);
        }
        if (callback) {
            if (this.debug) {
                console.log('Salesforce ping', res);
            }
            process.nextTick(callback);
        }
    });
};