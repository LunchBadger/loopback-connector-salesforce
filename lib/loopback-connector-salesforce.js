var Connector = require('loopback-connector').Connector;
var jsforce = require('jsforce');

require('util').inherits(SalesforceConnector, Connector);

exports.initialize = function initializeDataSource(dataSource, callback) {
    console.log(dataSource.settings);
    dataSource.connector = new SalesforceConnector(dataSource.settings);
    process.nextTick(function () {
        callback && callback();
    });
};

function SalesforceConnector(dataSourceProps) {
    this.username = dataSourceProps.username;
    this.password = dataSourceProps.password;

    this._models = {};
}

SalesforceConnector.prototype.all = function (model, filter, callback) {
    console.log('MODEL: ', model, '\nFILTER: ', filter, '\nCALLBACK: ', callback);
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