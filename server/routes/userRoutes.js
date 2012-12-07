//var mongoDb = require('./mongoDb');
var database = require('../tinyDb');

var userCollection = "user";

var isNumber = function(o) {
    return ! isNaN (o-0);
};

exports.addRoutes = function (server) {
    server.get('/api/user', function (request, response) {
        database.getAll(userCollection, function (err, items) {
            if (err) {
                console.log('error getting users from db: ', err);
                return;
            }

            var body = JSON.stringify(items);
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Content-Length', body.length);
            response.write(body);
            response.end();
        });
    });

    server.post('/api/user/save', function (request, response) {
        database.save(userCollection, request.body, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (!isNumber(result)) {
                response.write(JSON.stringify(result));
            }
            response.end();

        });
    });

    server.post('/api/user/delete/:id', function (request, response) {
        var id = request.params.id;
        database.removeById(userCollection, id, function (err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify({ quantityDeleted: result}));
            response.end();
        });
    });
};



