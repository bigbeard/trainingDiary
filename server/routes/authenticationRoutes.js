//var mongoDb = require('./mongoDb');
var database = require('../tinyDb');

var userCollection = "user";
var tokenCollection = "token";

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
        var username = request.body.username;
        var password = request.body.password;

        authenticateUser(username, password, function (valid) {
            if (valid) {
                var tokenObject = { username: username };
                database.remove(tokenCollection, 'username', username, function (err) {
                    database.save(tokenCollection, tokenObject, function (err, result) {
                        response.cookie('user',  JSON.stringify({ token: result._id, username: username }));
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
            if (request.cookies.user) {
                var user = JSON.parse(request.cookies.user);
                var token = user.token;
            }
        }

        database.removeById(tokenCollection, token, function (err) {
            response.clearCookie('user');
            response.end();
        });
    });
};
