var templateJS = function(options) {

    var particle = options.particle;

    return {

        execute : function(callback) {
            try {

                console.log('> this');
                console.log('> ' + particle.__type);

                return callback(null, true);
            }
            catch(err) {
                return callback(err, false);
            }
        }

    }
};

module.exports.create = function(options) {
    return new templateJS(options);
};
