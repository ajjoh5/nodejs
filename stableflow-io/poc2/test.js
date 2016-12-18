//Init vars
var path = require('path');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create RethinkDB handle
var sfQueue = require('./lib/stableflow-queue').create({}, function() {

    var wf = {
        "name": "workflow-01",
        "states": {
            "initial": {
                "send-email": {"to":"to@email.com", "from":"from@email.com","subject":"[NEW EMAIL] New email received","body":"Body of email here."},
                "create-task": {"assigned":"to@email.com,to2@email.com","title":"New Task","options":"submit,reject,reject to"}
            },
            "offshore check": {},
            "it mgr check": {},
            "final": {}
        }
    };

    //add wf to queue
    sfQueue.addQ(wf)
    .then(function(data) {
        return sfQueue.getQ()
    })
    //get queue data count()
    .then(function(data) {
        console.log(data);
    });
});