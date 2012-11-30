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

var mongoDatabase = {
    openDatabase: function (currentDb, callback) {
        currentDb.open(function (err, db) {
            if(err) {
                console.log(err);
                if (callback) {
                    callback(err);
                }
            } else {
                console.log('connected to db');
                if (callback) {
                    callback(db);
                }
            };
        });
    },
    clear: function (collectionName, callback) {
        getCollection(collectionName, function(err, collection) {
            collection.remove(function (err, collection) {
                if (err) {
                    console.log(err);
                    if (callback) {
                        callback(err);
                    }
                } else {
                    console.log('collection has been cleared');
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },
    getAll: function (collectionName, callback) {
        getCollection(collectionName, function(err, collection) {
            collection.find().toArray(function(err, items) {
                if (callback) {
                    callback(err, items);
                }
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
                    if (err) {
                        console.log(err);
                        if (callback) {
                            callback(err);
                        }
                    } else {
                        console.log(result);
                        if (callback) {
                            callback(err, result);
                        }
                    }
                });
            }
        });
    },
    removeById: function (collectionName, id, callback) {
        getCollection(collectionName, function(err, collection) {
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                var o_id = new BSON.ObjectID(id);
                collection.remove({ _id: o_id }, { safe: true }, function (err, result) {
                    if (err) {
                        console.log("mongo remove: ",err);
                        if (callback) {
                            callback(err);
                        }
                    } else {
                        if (callback) {
                            callback(err, result);
                        }
                    }
                });
            }
        });
    },
    findById: function (collectionName, id, callback) {
        getCollection(collectionName, function(err, collection) {
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                var o_id = new BSON.ObjectID(id);
                collection.find({ _id: o_id }).toArray(function (err, docs) {
                    console.log("Find: ", docs)
                });
            }
        });
    }
};

mongoDatabase.openDatabase(currentDb, function(db) {
    database = db;
});

module.exports = mongoDatabase;


