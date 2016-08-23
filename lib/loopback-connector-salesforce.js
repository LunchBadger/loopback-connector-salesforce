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

}