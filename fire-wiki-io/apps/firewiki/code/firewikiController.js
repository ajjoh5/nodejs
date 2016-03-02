
var firewikiController = function(app) {

    var rebootjs = require('reboot-js');

    //init firewiki
    var FireWiki = require(__base + '/index.js');
    var fw = new FireWiki();
    //var logger = new fw.Logger();
    //logger.log();
    //logger.write('new message');
    //logger.write('message 2');
    //logger.log();

    //init db
    var db = rebootjs.getDB();
    db.initDB('wikidb', __base + '/data/wiki.db');

    app.get('/', function(req, res) {

        console.time('home');
        var wikiSlug = 'home';

        db.find('wikidb', { slug : wikiSlug }).then(function(docs) {

            var home = {};
            if(!docs || docs.length < 1) {
                home = { slug: "home", title : "Home", content : "# Home Title Here.\n\nHere are the paragraphs...\n\nWith line breaks in between." };
                db.insert('wikidb', home);
            }
            else {
                var home = docs[0];
            }

            var html = fw.toHtml(home.content);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/index',
                'rmenu-action' : '<i class="fa fa-pencil"></i>&nbsp;Edit',
                'rmenu-js' : "editwiki('" + wikiSlug + "')",
                'article-title' : home.title,
                slug : wikiSlug,
                article : html
            };

            console.timeEnd('home');
            res.render(viewParams.viewFile, viewParams);

        }, function(error) {
            console.log(error);
            res.send(error);
        });
    });

    app.get('/?*/edit', function(req, res) {

        var wikiSlug = !(req.params[0]) ? 'home' : req.params[0];

        console.time('edit');

        //get the page we just came to
        db.find('wikidb', { slug : wikiSlug }).then(function(docs) {

            var home = docs[0];
            var html = fw.toHtml(home.content);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/edit',
                'rmenu-action' : '<i class="fa fa-save"></i>&nbsp;Save',
                'rmenu-js' : "savewiki('" + wikiSlug + "')",
                'article-title' : home.title,
                slug : wikiSlug,
                article : html,
                'article-markdown' : home.content
            };

            console.timeEnd('edit');
            res.render(viewParams.viewFile, viewParams);

        });
    });

    app.post('/?*/edit', function(req, res) {

        var wikiSlug = !(req.params[0]) ? 'home' : req.params[0];
        var markdown = req.body.markdown;

        //update the current wiki with the new contents
        db.update('wikidb', { slug : wikiSlug }, { $set: { content : markdown } }).then(function(num) {
            console.log('Updated: ' + num);

            res.status(200).send('Saved successfully!');
        }, function(error) {
            console.log(error);
        });
    });

    app.get('/:wiki', function(req, res) {

        var wikiSlug = !(req.params.wiki) ? 'home' : req.params.wiki;
        console.time('wiki');

        //get the page we just came to
        db.find('wikidb', { slug : wikiSlug }).then(function(docs) {

            var home = docs[0];
            var html = fw.toHtml(home.content);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/index',
                'rmenu-action' : '<i class="fa fa-pencil"></i>&nbsp;Edit',
                'rmenu-js' : "editwiki('" + wikiSlug + "')",
                'article-title' : home.title,
                slug : wikiSlug,
                article : html,
                'article-markdown' : home.content
            };

            console.timeEnd('wiki');
            res.render(viewParams.viewFile, viewParams);

        });
    });

    app.get('/:wiki/new', function(req, res) {

        var wikiSlug = !(req.params.wiki) ? 'home' : req.params.wiki;
        console.time('new wiki');

        db.find('wikidb', { slug : wikiSlug }).then(function(docs) {

            var newWiki = {};
            if(!docs || docs.length < 1) {
                newWiki = { slug: wikiSlug, title : wikiSlug, content : "" };
                db.insert('wikidb', newWiki);
            }
            else {
                newWiki = docs[0];
            }

            var html = fw.toHtml(newWiki.content);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/index',
                'rmenu-action' : '<i class="fa fa-pencil"></i>&nbsp;Edit',
                'rmenu-js' : "editwiki('" + wikiSlug + "')",
                'article-title' : newWiki.title,
                slug : wikiSlug,
                article : html
            };

            console.timeEnd('new wiki');
            res.render(viewParams.viewFile, viewParams);

        }, function(error) {
            console.log(error);
            res.send(error);
        });
    });
};

module.exports = firewikiController;