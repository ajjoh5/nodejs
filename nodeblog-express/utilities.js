function Utilities() {

    this.removeLastSlash = function(myUrl) {
        if (myUrl.substring(myUrl.length-1) === '/') {
            myUrl = myUrl.substring(0, myUrl.length-1);
        }

        return myUrl;
    };
}

module.exports = Utilities;