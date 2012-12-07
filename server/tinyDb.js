var tiny = require('tiny'),
uuid = require('node-uuid'),
coll = require('coll');

var dbs = coll.Dict();

var doCallback = function(callback, err, result, functionName) {
    if (functionName) {
        console.log(functionName + " err: ", err);
        console.log(functionName + " result: ", result);
    }
    if (err) {
        //console.log(err);
        if (callback) {
            callback(err);
        }
    } else {
        if (callback) {
            callback(err, result);
        }
    }
};

var compactDatabase = function (collectionName) {
    var db = dbs.get(collectionName);
    db.compact(function (err) {
        if (err) {
            console.log("Error compacting ", collectionName, err);
        } else {
            console.log(collectionName + " compacted");
        }
    });
};

var tinyDatabase = {
    openDatabase: function () {
        tiny('diary.tiny', function (err, database) {
            dbs.set('diary', database);
            console.log("Attached to diary.tiny");
            compactDatabase('diary');
        });
        tiny('user.tiny', function (err, database) {
            dbs.set('user', database);
            console.log("Attached to user.tiny");
            compactDatabase('user');
        });
        tiny('token.tiny', function (err, database) {
            dbs.set('token', database);
            console.log("Attached to token.tiny");
            compactDatabase('token');
        });
    },
    get: function(collectionName, fieldName, value, callback) {
        var db = dbs.get(collectionName);
        db.fetch({}, function(doc, key) { if (doc[fieldName] === value) return true; }, function (err, items) {
            doCallback(callback, err, items);
        });
    },
    getById: function(collectionName, id, callback) {
        var db = dbs.get(collectionName);
        db.fetch({}, function(doc, key) { if (key === id) return true; }, function (err, items) {
            doCallback(callback, err, items);
        });
    },
    getAll: function (collectionName, callback) {
        var db = dbs.get(collectionName);
        db.fetch({}, function() { return true;}, function (err, items) {
            doCallback(callback, err, items);
        });
    },
    insert: function (collectionName, doc, callback) {
        var db = dbs.get(collectionName);
        var id = uuid.v1();
        doc._id = id;
        db.set(id, doc, function (err) {
            doCallback(callback, err, doc);
        });
    },
    update: function (collectionName, doc, callback) {
        var db = dbs.get(collectionName);
        var id = doc._id;

        db.update(id, doc, function (err) {
            doCallback(callback, err, 1);
        });
    },
    save: function (collectionName, doc, callback) {
        if (doc._id) {
            tinyDatabase.update(collectionName, doc, callback);
        } else {
            tinyDatabase.insert(collectionName, doc, callback);
        }
    },
    remove: function (collectionName, fieldName, value, callback) {
        tinyDatabase.get(collectionName, fieldName, value, function (err, items) {
            if (items) {
                items.forEach(function(item) {
                    tinyDatabase.removeById(collectionName, item._key, function (err) {
                        if (err) {
                            console.log("Error removing token: ", err, item._key);
                        }
                    });
                });
            }
            doCallback(callback, err, undefined);
        });
    },
    removeById: function (collectionName, id, callback) {
        var db = dbs.get(collectionName);
        db.remove(id, function (err) {
            doCallback(callback, err, undefined);
        });
    },
};

tinyDatabase.openDatabase();


module.exports = tinyDatabase;


