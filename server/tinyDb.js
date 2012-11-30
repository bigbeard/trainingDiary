var tiny = require('tiny'),
uuid = require('node-uuid');
var db;

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

var tinyDatabase = {
    openDatabase: function () {
        tiny('diary.tiny', function (err, database) {
            db = database;
            console.log("Attached to diary.tiny");
        });
    },
    getAll: function (collectionName, callback) {
        db.fetch({}, function() { return true;}, function (err, items) {
            doCallback(callback, err, items);
        });
    },
    insert: function (collectionName, doc, callback) {
        var id = uuid.v1();
        doc._id = id;

        console.log("doc: ", doc);
        db.set(id, doc, function (err) {
            doCallback(callback, err, doc);
        });
    },
    update: function (collectionName, doc, callback) {
        var id = doc._id;

        db.update(id, doc, function (err) {
            doCallback(callback, err, 1);
        });
    },
    save: function (collectionName, doc, callback) {
        if (doc._id) {
            this.update(collectionName, doc, callback);
        } else {
            this.insert(collectionName, doc, callback);
        }
    },
    removeById: function (collectionName, id, callback) {
        db.remove(id, function (err) {
            doCallback(callback, err, undefined, "removeById");
        });
    },
};

tinyDatabase.openDatabase();


module.exports = tinyDatabase;


