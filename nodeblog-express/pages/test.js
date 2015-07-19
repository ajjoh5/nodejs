function Person(name) {
    this.name = name
}

Person.prototype = {
    greet: function () {
        return "Hello world, my name is " + this.name;
    }
};

//module.exports = Person;