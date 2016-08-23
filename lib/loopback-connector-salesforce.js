var Connector = require('loopback-connector').Connector;
var jsforce = require('jsforce');
var S = require('string');

require('util').inherits(SalesforceConnector, Connector);

exports.initialize = function initializeDataSource(dataSource, callback) {
    var settings = dataSourceProps.settings;

    dataSource.connector = new SalesforceConnector(settings, dataSource);

    if (callback) {
        if (s.lazyConnect) {
            process.nextTick(function () {
                callback();
            });
        } else {
            dataSource.connector.connect(callback);
        }
    }
};

function SalesforceConnector(settings, dataSource) {
    this.username = settings.username;
    this.password = settings.password;
    this.debug = settings.debug || debug.enabled;
    this.dataSource = dataSource;

    if (this.debug) {
        console.log(settings);
    }
}

SalesforceConnector.prototype.connect = function (callback) {
    var self = this;
    if (self.db) {
        process.nextTick(function () {
            callback && callback(null, self.db);
        });
    } else if (self.dataSource.connecting) {
        self.dataSource.once('connected', function () {
            process.nextTick(function () {
                callback && callback(null, self.db);
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
                console.log('Salesforce connection has been established');
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
}

SalesforceConnector.prototype.objectName = function (model) {
    var modelClass = this._models[model];
    model = modelClass.settings.salesforceObject || model;
    return model;
}

SalesforceConnector.prototype.baseQuery = function (model) {
    var template = 'SELECT {{fields}} FROM {{objectName}} WHERE ';
    var modelClass = this._models[model];
    var fields = modelClass.properties.map(property => property.name);
    var objectName = this.objectName(model);
    var query = S(template).template({
        fields: fields.join(', '),
        objectName: objectName
    }).s;
    return query;
}

SalesforceConnector.prototype.all = function (model, filter, callback) {
    var query = this.baseQuery(model);

    console.log('MODEL: ', model, '\nFILTER: ', filter, '\nCALLBACK: ', callback, '\nQUERY: ', query);
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.create = function (model, data, callback) {
    console.log('MODEL: ', model, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.updateOrCreate = function (model, data, callback) {
    console.log('MODEL: ', model, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.updateAttributes = function (model, id, data, callback) {
    console.log('MODEL: ', model, '\nID: ', id, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.destroyAll = function (model, where, callback) {
    console.log('MODEL: ', model, '\nWHERE: ', where, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.update = function (model, where, data, callback) {
    console.log('MODEL: ', model, '\nWHERE: ', where, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.ping = function (callback) {
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.discoverModelDefinitions = function (options, callback) {
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.discoverModelProperties = function (objectName, options, callback) {
    callback('Not yet implemented', null);
}

SalesforceConnector.prototype.discoverSchemas = function (objectName, options, callback) {
    callback('Not yet implemented', null);
}