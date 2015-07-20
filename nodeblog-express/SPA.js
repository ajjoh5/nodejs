// Constructor
function SPA(id, view, params) {

    var spa = {
        id : id,
        filepath : __dirname + '/' + id,
        params : []
    };

    this.view = view ? view : 'default';
    this.viewFile = spa.filepath + '/' + this.view;

    this.viewParams = {
        layout : spa.filepath + '/layouts/layout',
        spa: spa,
        title: 'About Me',
        brand: 'Adam Johnstone',
        pageTitle : 'Adam Johnstone | A disruptive tech innovator and entrepreneur in Melbourne'
    };
}

module.exports = SPA;