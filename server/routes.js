//var mongoDb = require('./mongoDb');
var database = require('./tinyDb');

var diaryCollection = "diary";
var userCollection = "user";

var isNumber = function(o) {
    return ! isNaN (o-0);
};

exports.addRoutes = function (server) {
    server.get('/ping', function (request, response) {
        response.status(401);
        response.render('error');
    });

    server.get('/diary', function (request, response) {
        database.getAll(diaryCollection, function (err, items) {
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

    server.post('/diary/save', function (request, response) {
        database.save(diaryCollection, request.body, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (!isNumber(result)) {
                response.write(JSON.stringify(result));
            }
            response.end();

        });
    });

    server.post('/diary/delete/:id', function (request, response) {
        var id = request.params.id;
        database.removeById(diaryCollection, id, function (err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify({ quantityDeleted: result}));
            response.end();
        });
    });

    server.get('/user', function (request, response) {
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

    server.post('/user/save', function (request, response) {
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

    server.post('/user/delete/:id', function (request, response) {
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


