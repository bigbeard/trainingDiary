var express = require('express'),
routes = require('./server/routes'),
database = require('./server/tinyDb');

var port = process.env.PORT || 3000;

var validateToken = function (token, callback) {
    database.getById('token' ,token, function (err, item) {
        if (err) {
            callback(false);
        } else if (!item) {
            callback(false);
        } else {
            callback(true, item.username);
        }
    });
};

var authenticator = function (request, response, next) {
    if (request.cookies) {
        var token = request.cookies.token.value;
    }
    validateToken(token, function (valid, username) {
        if (valid) {
            next();
        } else {
            response.send(401, 'Token not valid');
        }
    });
};

var createServer = function (port) {
    var server = express();

    server.configure(function(){
        server.use(express.bodyParser());
        server.set('view engine', 'jshtml');
        server.use(express.static(__dirname + '/client'));
        server.use(express.cookieParser('mmmcheese'));
        server.use('/api', authenticator);
    });

    server.configure('development', function(){
        server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    server.configure('production', function(){
        server.use(express.errorHandler());
    });

    routes.addRoutes(server);

    server.listen(port, function(){
        console.log("Express server listening on port %d in %s mode", port, server.settings.env);
    });

};

createServer(port);

