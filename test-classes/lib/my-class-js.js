//high level myClass object
var myClass = function(options) {
    this.name = 'adam johnstone';
    this.age = 33;

    return {

        saySomething: function() {
            console.log('wassupp');
        }
    };
};

myClass.prototype.getName = function() {
    return this.name;
};

//Create logger class and attach it to myClass as new object
var Logger = function(options) {

    this.logs = [];

    this.log = function() {
        console.log(this.logs);
    };

    this.write = function(message) {
        this.logs.push(message);
    };
};

myClass.prototype.Logger = Logger;


module.exports = myClass;
