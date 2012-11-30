var mongo = require('mongodb'),
mongoServer = mongo.Server,
mongoDb = mongo.Db,
BSON = mongo.BSONPure;

var dbServer = new mongoServer('localhost', 27017, { auto_reconnect: true });
var currentDb = new mongoDb('training', dbServer, { w: 'majority' });
var database;


var getCollection = function (collectionName, callback) {
    database.collection(collectionName, function(err, collection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(err, collection);
        };
    });
};

var doCallback = function(callback, err, result, functionName) {
    if (functionName) {
        console.log(functionName + " err: ", err);
        console.log(functionName + " result: ", result);
    }
    if (err) {
        console.log(err);
        if (callback) {
            callback(err);
        }
    } else {
        if (callback) {
            callback(err, result);
        }
    }
};

var mongoDatabase = {
    openDatabase: function (currentDb, callback) {
        currentDb.open(function (err, db) {
            doCallback(callback, err, db, false);
        });
    },
    clear: function (collectionName, callback) {
        getCollection(collectionName, function(err, collection) {
            collection.remove(function (err, collection) {
                doCallback(callback, err);
            });
        });
    },
    getAll: function (collectionName, callback) {
        getCollection(collectionName, function(err, collection) {
            collection.find().toArray(function(err, items) {
                doCallback(callback, err, items);
            });
        });
    },
    insert: function (collectionName, doc, callback) {
        getCollection(collectionName, function(err, collection) {
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                collection.insert(doc, {safe: true}, function (err, result) {
                    doCallback(callback, err, result);
                });
            }
        });
    },
    save: function (collectionName, doc, callback) {
        getCollection(collectionName, function(err, collection) {
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                console.log("save: ", doc);
                if (doc._id) {
                    var o_id = new BSON.ObjectID(doc._id);
                    doc._id = o_id;
                }
                collection.save(doc, {safe: true}, function (err, result) {
                    doCallback(callback, err, result, "save");
                });
            }
        });
    },
    removeById: function (collectionName, id, callback) {
        getCollection(collectionName, function(err, collection) {
            console.log("removeById id: ", id);
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                var o_id = new BSON.ObjectID(id);
                collection.remove({ _id: o_id }, { safe: true }, function (err, result) {
                    doCallback(callback, err, result, "removeById");
                });
            }
        });
    },
    findById: function (collectionName, id, callback) {
        console.log("Find id: ", id);
        getCollection(collectionName, function(err, collection) {
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                var o_id = new BSON.ObjectID(id);
                collection.find({ _id: o_id }).toArray(function (err, docs) {
                    doCallback(callback, err, docs, "findById");
                });
            }
        });
    }
};

mongoDatabase.openDatabase(currentDb, function(err, db) {
    database = db;
});

module.exports = mongoDatabase;


