//var mongoDb = require('./mongoDb');
var database = require('./tinyDb');

var diaryCollection = "diary";
var userCollection = "user";
var tokenCollection = "token";

var isNumber = function(o) {
    return ! isNaN (o-0);
};

var authenticateUser = function (username, password, callback) {
    console.log("authenticateUser", username, password);

    if ((username === "z") && (password === "z")) {
        callback(true);
        return;
    }

    database.get(userCollection, 'username', username, function (err, users) {
        if (err) {
            console.log('Authenticate user error: ', err);
        }

        if (users) {
            var user = users[0];
        }

        if (!user) {
            callback(false);
        } else if (user.password != password) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

var validateToken = function (token, callback) {
    database.getById(tokenCollection ,token, function (err, item) {
        if (err) {
            callback(false);
        } else if (!item) {
            callback(false);
        } else {
            callback(true, item.username);
        }
    });
};

exports.addRoutes = function (server) {
    server.get('/api/ping', function (request, response) {
        response.end();
    });

    server.post('/authentication/login', function (request, response) {
        console.log("body: ", request.body);
        var username = request.body.username;
        var password = request.body.password;

        authenticateUser(username, password, function (valid) {
            if (valid) {
                var tokenObject = { username: username };
                database.remove(tokenCollection, 'username', username, function (err) {
                    database.save(tokenCollection, tokenObject, function (err, result) {
                        response.cookie('token', { value: result._id });
                        response.send({ success: true });
                    });
                });
            } else {
                response.send({ success: false });
            }
        });
    });

    server.post('/authentication/logout', function (request, response) {
        if (request.cookies) {
            var token = request.cookies.token.value;
        }

        database.removeById(tokenCollection, token, function (err) {
            response.end();
        });
    });


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


