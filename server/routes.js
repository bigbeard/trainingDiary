//var mongoDb = require('./mongoDb');
var database = require('./tinyDb');

var collection = "diary";

var isNumber = function(o) {
    return ! isNaN (o-0);
};

exports.addRoutes = function (server) {
    server.get('/diary', function (request, response) {
        database.getAll(collection, function (err, items) {
            if (err) {
                console.log('error getting diary data from db: ', err);
                return;
            }

            var body = JSON.stringify(items);
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Content-Length', body.length);
            response.write(body);
            response.end();
        });
    });

    server.post('/addDiaryEntry', function (request, response) {
        database.insert(collection, request.body, function(err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify(result[0]));
            response.end();
        });
    });

    server.post('/save', function (request, response) {
        database.save(collection, request.body, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (!isNumber(result)) {
                response.write(JSON.stringify(result));
            }
            response.end();

        });
    });

    server.post('/deleteDiaryEntry/:id', function (request, response) {
        var id = request.params.id;
        database.removeById(collection, id, function (err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify({ quantityDeleted: result}));
            response.end();
        });
    });

    server.post('/updateDiaryEntry', function (request, response) {
        database.insert(collection, request.body, function(err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify(result[0]));
            response.end();
        });
    });
};


