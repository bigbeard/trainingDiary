//var mongoDb = require('./mongoDb');
var database = require('../tinyDb');

var diaryCollection = "diary";

var isNumber = function(o) {
    return ! isNaN (o-0);
};

exports.addRoutes = function (server) {
    server.get('/api/diary', function (request, response) {
        database.getAll(diaryCollection, function (err, items) {
            if (err) {
                console.log('error getting diary data from db: ', err);
                return;
            }

            var body = JSON.stringify(items);
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Content-Length', body.length);
            response.send(body);
        });
    });

    server.post('/api/diary/save', function (request, response) {
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

    server.post('/api/diary/delete/:id', function (request, response) {
        var id = request.params.id;
        database.removeById(diaryCollection, id, function (err, result) {
            if (err) {
                console.log(err);
            }
            response.write(JSON.stringify({ quantityDeleted: result}));
            response.end();
        });
    });
};


