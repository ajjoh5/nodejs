//NodeJS Plugins
var fs = require('fs');
var path = require('path');

//Express Plugins
var express = require('express');
var compress = require('compression');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var art = require('ascii-art');

//Reboot Plugins
var rebootUtilities = require('./reboot-utilities');
var rebootRoutes = require('./reboot-routes');

function go() {

    //init variables
    var appDir = path.dirname(require.main.filename);
    var rebootConfig = rebootUtilities.rbJsonFileSync(__dirname + '/reboot-config.json');

    //Setup environment variable
    process.env.NODE_ENV = rebootConfig.env;

    //Create & Configure express app
    var app = express();

    //Used compression in the app
    app.use(compress());

    hbs = exphbs.create({
        extname: 'handlebars',
        defaultLayout: rebootConfig['default-layout'],
        partialsDir: [rebootConfig['partials-directory']],
        layoutsDir: rebootConfig['layouts-directory'],
        helpers: {
            block: function (name) {
                var blocks  = this._blocks,
                    content = blocks && blocks[name];

                return content ? content.join('\n') : null;
            },

            contentFor: function (name, options) {
                var blocks = this._blocks || (this._blocks = {}),
                    block  = blocks[name] || (blocks[name] = []);

                block.push(options.fn(this));
            }
        }
    });

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.use(bodyParser.urlencoded({ extended: true }));

    //Create server on configured port
    app.listen(rebootConfig.port, function() {
        console.log('Server running at: ' + rebootConfig.port);

        art.font('reboot', 'Doom', function(rendered){

            loadAllRebootCodeFiles();
            rebootRoutes.init(app, rebootConfig);
            console.log(rendered);
        });
    });

    function loadAllRebootCodeFiles() {
        console.log('Booting files...');
        var rootDir = path.dirname(require.main.filename);
        var dir = rootDir + '/' + rebootConfig['reboot-apps-directory'];
        var apps = fs.readdirSync(dir);

        //cycle through apps
        for(var i in apps) {
            var appName = apps[i];
            var appDir = path.resolve(dir, appName);

            //Setup partials directory in 'found app directory'
            hbs.partialsDir.push(appDir + '/views/partials/');

            var appCodeDir = path.resolve(appDir, 'code');
            var files = fs.readdirSync(appCodeDir);

            for(var f in files) {
                var codeFile = path.resolve(appCodeDir, files[f]);

                var stats = fs.statSync(codeFile);
                if (stats.isFile()) {
                    require(codeFile)(app);
                    console.log(codeFile.replace(rootDir, ''));
                }
            }
        }
    }
}

module.exports.go = go;
