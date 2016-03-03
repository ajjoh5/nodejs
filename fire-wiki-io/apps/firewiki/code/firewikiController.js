
var firewikiController = function(app) {

    //init firewiki
    var FireWiki = require(__base + '/index.js');
    var fw = new FireWiki();

    //var logger = new fw.Logger();
    //logger.log();
    //logger.write('new message');
    //logger.write('message 2');
    //logger.log();

    function displayWiki(slug) {

    }


    app.get('/', function(req, res) {

        console.log('Serving wiki - "home"');
        console.time('home');
        var wiki = {};

        // Get default 'home' wiki
        fw.findOneWiki('home')
        .then(function(fWiki) {
            // If there's no home wiki - create one now
            wiki = fWiki;
            if (!fWiki) {
                wiki = {
                    slug: "home",
                    title: "Home",
                    content: "# Home Title Here.\n\nHere are the paragraphs...\n\nWith line breaks in between."
                };
                fw.insertWiki(wiki);
            }

            // Return all wiki slugs
            return fw.allWikiSlugs();
        })
        .then(function(slugsArray) {
            // Get wiki content links [[ link ]]
            return fw.getFireWikiContent(wiki.content, slugsArray);
        })
        .then(function(wikiContent) {

            // convert markdown -->> html
            var html = fw.toHtml(wikiContent);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/index',
                'rmenu-action' : '<i class="fa fa-pencil"></i>&nbsp;Edit',
                'rmenu-js' : "editwiki('" + wiki.slug + "')",
                'article-title' : wiki.title,
                slug : wiki.slug,
                article : html
            };

            console.timeEnd('home');
            res.render(viewParams.viewFile, viewParams);
        });
    });

    app.get('/wiki/:wiki/edit', function(req, res) {

        var wikiSlug = req.params.wiki;
        console.log('Editing wiki - "' + wikiSlug + '"');
        console.time('- time');

        var wiki = {};

        // Get default 'home' wiki
        fw.findOneWiki(wikiSlug)
        .then(function(fWiki) {
            // If there's no home wiki - create one now
            wiki = fWiki;

            // Get wiki content links [[ link ]]
            return fw.getFireWikiContent(wiki.content, []);
        })
        .then(function(wikiContent) {

            // convert markdown -->> html
            var html = fw.toHtml(wikiContent);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/edit',
                'rmenu-action' : '<i class="fa fa-save"></i>&nbsp;Save',
                'rmenu-js' : "savewiki('" + wiki.slug + "')",
                'article-title' : wiki.title,
                slug : wiki.slug,
                article : html,
                'article-markdown' : wiki.content
            };

            console.timeEnd('- time');
            res.render(viewParams.viewFile, viewParams);
        });

    });

    app.post('/wiki/:wiki/edit', function(req, res) {

        var wikiSlug = req.params.wiki;
        var markdown = req.body.markdown;

        //update the wiki
        fw.updateOneWiki(wikiSlug, markdown)
        .then(function(message) {
            res.status(200).send('Saved successfully!');
        });
    });

    app.get('/wiki/:wiki', function(req, res) {

        var wikiSlug = !(req.params.wiki) ? 'home' : req.params.wiki;
        console.log('Serving wiki - "' + wikiSlug + '"');
        console.time(wikiSlug);

        var wiki = {};

        // Get default 'home' wiki
        fw.findOneWiki(wikiSlug)
        .then(function(fWiki) {
            // If there's no home wiki - create one now
            wiki = fWiki;

            // Return all wiki slugs
            return fw.allWikiSlugs();
        })
        .then(function(slugsArray) {
            // Get wiki content links [[ link ]]
            return fw.getFireWikiContent(wiki.content, slugsArray);
        })
        .then(function(wikiContent) {

            // convert markdown -->> html
            var html = fw.toHtml(wikiContent);

            var viewParams = {
                layout : __dirname + '/../views/layouts/layout',
                viewFile : __dirname + '/../views/index',
                'rmenu-action' : '<i class="fa fa-pencil"></i>&nbsp;Edit',
                'rmenu-js' : "editwiki('" + wiki.slug + "')",
                'article-title' : wiki.title,
                slug : wiki.slug,
                article : html
            };

            console.timeEnd(wikiSlug);
            res.render(viewParams.viewFile, viewParams);
        });
    });

    //app.get('/:wiki/new', function(req, res) {
    //
    //    var wikiSlug = !(req.params.wiki) ? 'home' : req.params.wiki;
    //    console.time('new wiki');
    //
    //    db.find('wikidb', { slug : wikiSlug }).then(function(docs) {
    //
    //        var newWiki = {};
    //        if(!docs || docs.length < 1) {
    //            newWiki = { slug: wikiSlug, title : wikiSlug, content : "" };
    //            db.insert('wikidb', newWiki);
    //        }
    //        else {
    //            newWiki = docs[0];
    //        }
    //
    //        var html = fw.toHtml(newWiki.content);
    //
    //        var viewParams = {
    //            layout : __dirname + '/../views/layouts/layout',
    //            viewFile : __dirname + '/../views/index',
    //            'rmenu-action' : '<i class="fa fa-pencil"></i>&nbsp;Edit',
    //            'rmenu-js' : "editwiki('" + wikiSlug + "')",
    //            'article-title' : newWiki.title,
    //            slug : wikiSlug,
    //            article : html
    //        };
    //
    //        console.timeEnd('new wiki');
    //        res.render(viewParams.viewFile, viewParams);
    //
    //    }, function(error) {
    //        console.log(error);
    //        res.send(error);
    //    });
    //});
};

module.exports = firewikiController;