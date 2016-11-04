'use strict';

var Connector = require('loopback-connector').SqlConnector;
var ParameterizedSQL = Connector.ParameterizedSQL;
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

function format(sql, params) {
    if (Array.isArray(params)) {
        var count = 0;
        var index = -1;
        while (count < params.length) {
            index = sql.indexOf('(?)');
            if (index === -1) {
                return sql;
            }
            sql = sql.substring(0, index) + escape(params[count]) +
                sql.substring(index + 3);
            count++;
        }
    }
    return sql;
}

function parameterizedSQL(sql) {
    var count = 0;
    var index = -1;
    while (true) {
        index = sql.indexOf('(?)');
        if (index === -1) {
            break;
        }
        count++;
        sql = sql.substring(0, index) + ('@param' + count) +
            sql.substring(index + 3);
    }
    return sql;
}

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

SalesforceConnector.prototype.tableEscaped = function (model) {
    var modelClass = this._models[model];
    model = modelClass.settings.salesforceObject || model;
    return model;
};

SalesforceConnector.prototype.getDefaultIdType = function () {
    return 'string';
};

SalesforceConnector.prototype.all = function (model, filter, callback) {
    var query = '';
    try {
        query = this.buildSelect(model, filter, {});

        var sql = parameterizedSQL(query.sql);
        var records = [];

        //Do pagination
        this.db.query(sql)
            .on('record', (record) => {
                records.push(record);
            })
            .on('end', () => {
                callback(null, records);
            })
            .on('error', (err) => {
                console.error('Error executing query', sql, query, err);
                callback(err, records);
            })
            .run({
                autoFetch: true,
                maxFetch: 1000000
            });
    } catch (err) {
        console.error('There was a problem generating the query, ', query, err);
        callback(err, null);
    }
};

SalesforceConnector.prototype.toColumnValue = function (prop, val) {
    if (val == null) {
        return null;
    }
    if (prop.type === String) {
        return String(val);
    }
    if (prop.type === Number) {
        if (isNaN(val)) {
            // Map NaN to NULL
            return val;
        }
        return val;
    }

    if (prop.type === Date || prop.type.name === 'Timestamp') {
        if (!val.toUTCString) {
            val = new Date(val);
        }
        //Format Salesforce dates here
        val = (val);
        return val;
    }

    if (prop.type === Boolean) {
        if (val) {
            return true;
        } else {
            return false;
        }
    }

    return this.serializeObject(val);
};

SalesforceConnector.prototype.getPlaceholderForValue = function (key) {
    return '@param' + key;
};

SalesforceConnector.prototype.escapeName = function (name) {
    return name.replace(/\./g, '_');
};

SalesforceConnector.prototype.buildColumnNames = function (model, filter, options) {
    var columnNames = this.invokeSuper('buildColumnNames', model, filter);
    return columnNames;
};

SalesforceConnector.prototype.buildSelect = function (model, filter, options) {
    var selectStmt = new ParameterizedSQL('SELECT ' + this.buildColumnNames(model, filter, options) + ' FROM ' + this.tableEscaped(model));

    console.log('Filter: ', filter);

    if (filter) {
        if (filter.where) {
            var whereStmt = this.buildWhere(model, filter.where);
            whereStmt.sql = whereStmt.sql
                .replace(/(IS NULL)/ig, '= null')
                .replace(/(IS NOT NULL)/ig, '!= null');
            console.log('Where: ', whereStmt);
            selectStmt.merge(whereStmt);
        }
    }

    selectStmt = this.parameterize(selectStmt);

    console.log('Select Statement: ', selectStmt);

    selectStmt = this.replaceParameters(selectStmt);

    return selectStmt;
};

SalesforceConnector.prototype.replaceParameters = function (stmt) {
    if (Array.isArray(stmt.params) && stmt.params.length > 0) {
        for (var i = 0, n = stmt.params.length; i < n; i++) {
            var re = new RegExp('(@param' + (parseInt(i) + 1) + ')', 'ig');
            if ((typeof stmt.params[i] === 'number' && stmt.params[i] % 1 !== 0) || typeof stmt.params[i] === 'boolean') {
                // Float number
                stmt.sql = stmt.sql.replace(re, stmt.params[i]);
            }else if(typeof stmt.params[i] === 'undefined' || stmt.params[i] === null || stmt.params[i] === 'null'){
                stmt.sql = stmt.sql.replace(re, 'null');
            } else {
                stmt.sql = stmt.sql.replace(re, '\'' + stmt.params[i] + '\'');
            }
        }
    }
    return stmt;
}

SalesforceConnector.prototype.buildExpression = function (columnName, operator, operatorValue, propertyDefinition) {
    console.log('columnName: ', columnName);
    console.log('operator: ', operator);
    console.log('operatorValue: ', operatorValue);
    console.log('propertyDefinition: ', propertyDefinition);

    switch (operator) {
        case 'like':
            return new ParameterizedSQL(columnName + " LIKE ? ESCAPE '\\'", [operatorValue]);
        case 'nlike':
            return new ParameterizedSQL(columnName + " NOT LIKE ? ESCAPE '\\'", [operatorValue]);
        case 'regexp':
            console.error('Salesforce does not support the regular expression operator');
        default:
            // invoke the base implementation of `buildExpression`
            return this.invokeSuper('buildExpression', columnName, operator, operatorValue, propertyDefinition);
    }
};

SalesforceConnector.prototype.create = function (model, data, callback) {
    try {
        this.db.sobject(this.tableEscaped(model)).create(data, function (err, ret) {
            callback(err, ret);
        });
    } catch (err) {
        callback(err, 'Failed to create object');
    }
};

SalesforceConnector.prototype.updateOrCreate = function (model, data, callback) {
    console.log('MODEL: ', model, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('updateOrCreate Not yet implemented', null);
};

SalesforceConnector.prototype.updateAttributes = function (model, id, data, callback) {
    try {
        if (!data.hasOwnProperty('Id')) {
            data.Id = id;
        }
        this.db.sobject(this.tableEscaped(model)).update(data, function (err, ret) {
            callback(err, ret);
        });
    } catch (err) {
        callback(err, 'Failed to update attributes');
    }
};

SalesforceConnector.prototype.destroyAll = function (model, where, callback) {
    try {
        var self = this;
        var query = this.buildSelect(model, { where: where }, {});
        var sql = parameterizedSQL(query.sql);

        this.db.query(sql, function (err, result) {
            try {
                if (err) {
                    console.error('Error executing query', sql, query, err);
                }

                var ids = result.records.map(function (record) { return record.Id; });

                if (ids && ids.length > 0) {
                    self.db.sobject(self.tableEscaped(model)).destroy(ids, function (err, ret) {
                        callback(err, ret);
                    });
                }else{
                    callback(undefined, 'Nothing to destroy');
                }
            } catch (err) {
                callback(err, 'Failed to destroy objects');
            }
        });
    } catch (err) {
        callback(err, 'Failed to destroy objects');
    }
};

SalesforceConnector.prototype.update = function (model, where, data, callback) {
    console.log('MODEL: ', model, '\nWHERE: ', where, '\nDATA: ', data, '\nCALLBACK: ', callback);
    callback('update Not yet implemented', null);
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