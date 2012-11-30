var mongoDb = require('./mongoDb');


var collection = "diary";

exports.addRoutes = function (server) {
    server.get('/diary', function (request, response) {
        mongoDb.getAll(collection, function (err, items) {
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
        mongoDb.insert(collection, request.body, function(err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify(result[0]));
            response.end();
        });
    });

    server.post('/deleteDiaryEntry/:id', function (request, response) {
        var id = request.params.id;
        mongoDb.removeById(collection, id, function (err) {
            if (err) {
                console.log(err);
            }
            response.end();
        });
    });
};


