//Init required frameworks
var showdown = require('showdown');
var Q = require('q');
var _ = require('underscore');
var rebootjs = require('reboot-js');

//Create high level class
var FireWiki = function() {

    this.converter = new showdown.Converter();

    //init db
    this.db = rebootjs.getDB();
    this.db.initDB('wikidb', __base + '/data/wiki.db');

    //this.name = 'adam johnstone';
};

FireWiki.prototype.getFireWikiContent = function(text, slugsArray) {

    var deferred = Q.defer();

    var retval = text;
    var linkStart = text.indexOf('[[');

    while(linkStart > -1) {

        var linkEnd = retval.indexOf(']]', linkStart);
        var link = retval.substring(linkStart + 2, linkEnd);

        if(_.contains(slugsArray, link.toLowerCase())) {
            retval = retval.replace('[[' + link + ']]', '<a href="/wiki/' + link.toLowerCase() + '">' + link + '</a>');
        }
        else {
            retval = retval.replace('[[' + link + ']]', '<a href="/wiki/' + link.toLowerCase() + '/new">' + link + '</a>');
        }

        linkStart = retval.indexOf('[[', linkEnd + 2);
    }

    deferred.resolve(retval);

    return deferred.promise;
};

FireWiki.prototype.toHtml = function(text) {
    return this.converter.makeHtml(text);
};

FireWiki.prototype.insertWiki = function(wiki) {
    wiki.slug = wiki.slug.toLowerCase();
    this.db.insert('wikidb', wiki);
};

FireWiki.prototype.findOneWiki = function(wikiSlug) {

    var deferred = Q.defer();

    wikiSlug = wikiSlug.toLowerCase();

    this.db.find('wikidb', { slug : wikiSlug }).then(function(docs) {

        var wiki = null;

        if(docs.length > 0) {
            wiki = docs[0]
        }

        deferred.resolve(wiki);

    }, function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

FireWiki.prototype.updateOneWiki = function(wikiSlug, markdown) {

    var deferred = Q.defer();

    wikiSlug = wikiSlug.toLowerCase();

    //update the current wiki with the new contents
    this.db.update('wikidb', { slug : wikiSlug }, { $set: { content : markdown } })
    .then(function(num) {
        console.log('- updated records: ' + num);
        deferred.resolve('Saved successfully!');
    }, function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

FireWiki.prototype.allWikiSlugs = function() {

    var deferred = Q.defer();

    this.db.find('wikidb', {}).then(function(docs) {

        var wikiSlugs = [];

        if(docs.length > 0) {
            _.each(docs, function(item) {

                //Add current slug string to array string
                wikiSlugs.push(item.slug)
            });
        }

        deferred.resolve(wikiSlugs);

    }, function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

//Create logger class and attach it to FireWiki as new object
var Logger = function() {

    this.logs = [];

    this.log = function() {
        console.log(this.logs);
    };

    this.write = function(message) {
        this.logs.push(message);
    };
};

FireWiki.prototype.Logger = Logger;


module.exports = FireWiki;