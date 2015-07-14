var Hapi = require('hapi');

module.exports.version = 1.39;

module.exports.new_func = function(server) {

    console.log('New version up and running - I Just loaded this test.js file...');

}

module.change_code = 1;

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/swap',
    handler: function (request, reply) {
        //test.new_func(server);

        reply('Just ran the swap method');
    }
});

server.ext('onRequest', function(request, reply) {

    console.log('Caught Request : ' + request.path);
    return reply.continue();
});
