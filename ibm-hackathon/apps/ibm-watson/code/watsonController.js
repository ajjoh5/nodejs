var watsonController = function(app) {

    var fs = require('fs');
    var parse = require('csv-parse');
    var watson = require('watson-developer-cloud');
    var _ = require('underscore');
    var request = require("request");
    var cheerio = require("cheerio");
    var async = require("async");
    var format = require("string-format");


    //Peter (IAG), Yan (IAG), Stephen (IAG), Amanjeet (IAG), Ian (Fairfax)

    function getArticle(article, callback) {

        var alchemy_language = watson.alchemy_language({
            api_key: '471ccf386c13f586b9872de945f4834b390a0807'
        });

        var params = {
            url : article.url
        };

        if(params.url && params.url != '') {
            alchemy_language.text(params, function (err, response) {
                if (err) {
                    console.log('error:', err);
                    //callback(err, null);
                    callback(null, article);
                }
                else {
                    console.log('- Processing URL: ' + article.url.substr(0,50) + '...');
                    //console.log(JSON.stringify(response, null, 2));
                    article.text = response.text;
                    callback(null, article);
                }
            });
        }
    }

    function getTone(article, callback) {

        var tone_analyzer = watson.tone_analyzer({
            username: 'e58ec7eb-cd00-4998-a983-230f60e6a510',
            password: '8higA6f44Oxu',
            version: 'v3-beta',
            version_date: '2016-02-11'
        });

        tone_analyzer.tone({ text: article.text },
            function(err, tone) {
                if (err)
                    console.log(err);
                else {
                    console.log('- Processing Tone for article: ' + article.title.substr(0,50) + '...');
                    article.tone = tone;
                    callback(null, article);
                }
            });
    }

    app.get('/ibm-watson/hello', function(req, res) {

        var file = fs.readFileSync(__base + '/files/articles-20.csv', 'utf8').toString();

        console.time('Watson-strip-articles');
        console.log('[ Parse CSV File with Articles ]');

        var parser = parse(file, {delimiter: ','}, function (err, data) {
            console.log(format('[ Strip Articles - using Watson API ({0} articles) ]', data.length - 1));
            //console.log(data);
            var articles = [];
            var promises = [];

            //Get the article titles + urls
            _.each(data, function (item) {
                var article = {
                    title : item[1],
                    url : item[2]
                };

                if(article.title != 'title') {
                    articles.push(article);
                    promises.push(function(callback) {
                        //Async the get listings for the URL + page number
                        getArticle(article, callback);
                    });
                }
            });

            //Once al watson text strips requests run, run the results
            async.parallel(promises, function (err, results) {

                console.timeEnd('Watson-strip-articles');
                console.log('- Parsed all articles - analyzing...');
                console.log('[ Getting each articles tone ]');
                console.time('Watson-get-tone');
                var tonePromises = [];
                _.each(results, function(item) {
                    tonePromises.push(function(callback) {
                       getTone(item, callback);
                    });
                });

                async.parallel(tonePromises, function (err, results2) {

                    console.timeEnd('Watson-get-tone');
                    //var viewParams = {
                    //    layout : __dirname + '/../views/layouts/layout',
                    //    viewFile : __dirname + '/../views/hello',
                    //    message : 'Watson',
                    //    data : JSON.stringify(results2, null, 2)
                    //    //toneMessage : toneMessage,
                    //    //tone : JSON.stringify(tone, null, 2)
                    //};

                    //res.render(viewParams.viewFile, viewParams);
                    res.send(results2);
                });


            });



            //var tone_analyzer = watson.tone_analyzer({
            //    username: 'e58ec7eb-cd00-4998-a983-230f60e6a510',
            //    password: '8higA6f44Oxu',
            //    version: 'v3-beta',
            //    version_date: '2016-02-11'
            //});
            //
            //var toneMessage = "Greetings from Watson Developer Cloud! This is Adam and I'd like to say a big hello and welcome to the platform and hopefully we can do something awesome with it.";
            //tone_analyzer.tone({ text: toneMessage },
            //    function(err, tone) {
            //        if (err)
            //            console.log(err);
            //        else
            //        //console.log(JSON.stringify(tone, null, 2));
            //
            //            var viewParams = {
            //                layout : __dirname + '/../views/layouts/layout',
            //                viewFile : __dirname + '/../views/hello',
            //                message : 'Watson',
            //                toneMessage : toneMessage,
            //                tone : JSON.stringify(tone, null, 2)
            //            };
            //
            //        res.render(viewParams.viewFile, viewParams);
            //    });

        });

    });
}
module.exports = watsonController;