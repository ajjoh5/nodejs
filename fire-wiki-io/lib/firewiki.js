//Init required frameworks
var showdown = require('showdown');


//Create high level class
var FireWiki = function() {

    this.converter = new showdown.Converter();

    //this.name = 'adam johnstone';
    //this.age = 33;
};

FireWiki.prototype.toHtml = function(text) {
    return this.converter.makeHtml(text)
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