var authenticationRoutes = require('./authenticationRoutes'),
    userRoutes = require('./userRoutes'),
    diaryRoutes = require('./diaryRoutes');

exports.addRoutes = function (server) {
    authenticationRoutes.addRoutes(server);
    userRoutes.addRoutes(server);
    diaryRoutes.addRoutes(server);
};


