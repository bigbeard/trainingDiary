var express = require('express'),
    routes = require('./routes');

var port = 3000;

var createServer = function (port) {
    var server = express();

    server.configure(function(){
        server.use(express.bodyParser());
        server.set('view engine', 'jshtml');
        server.use(express.static(__dirname + '/../client'));
        console.log("dirname: ", __dirname);
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

