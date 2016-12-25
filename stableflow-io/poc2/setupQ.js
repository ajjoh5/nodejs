//Init vars
var path = require('path');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create RethinkDB handle
var sfQueue = require('./lib/stableflow-queue').create({}, function() {

    var wf = {
        "name": "workflow-01",
        "states": {
            "0|initial": {
                "0|send-email": {"to":"ajjoh5@gmail.com", "from":'"Adam Johnstone" <ajjoh5@gmail.com>',"subject":"[NEW EMAIL] New email received","bodyText" : "Body of text email here...", "bodyHtml":"Body of <strong>email</strong> here."},
                "1|create-task": {"assigned":"to@email.com,to2@email.com","title":"New Task","options":"submit,reject,reject to"}
            },
            "1|run trigger": {
                "0|http-get": {"url":"https://en.wikipedia.org/w/api.php?action=query&titles=Star%20Wars&prop=revisions&rvprop=content&format=json"}
            },
            "2|offshore check": {},
            "3|it mgr check": {},
            "4|final": {}
        }
    };

    //clear queue on startup
    sfQueue.clearQ()

    //list queue
    .then(function(data) {
        return sfQueue.listQ();
    })
    //add new wf to queue
    .then(function(data) {
        console.log("List Queue... ");
        console.log(JSON.stringify(data));

        return sfQueue.addQ(wf);
    })

    //list queue
    .then(function(data) {
        return sfQueue.listQ()
    })
    .then(function(data) {
        console.log("List Queue... ");
        console.log(JSON.stringify(data));

        //stop running script
        process.exit(0);
    });
});