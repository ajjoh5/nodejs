// Constructor
function Pages() {

    var spa = {
        id : 'pages',
        filepath : __dirname,
        params : []
    };

    this.view = 'default';
    this.viewFile = spa.filepath + '/' + this.view;

    this.viewParams = {
        layout : spa.filepath + '/layouts/layout',
        spa: spa,
        title: 'About Me',
        brand: 'Adam Johnstone'
    };
}

module.exports = Pages;