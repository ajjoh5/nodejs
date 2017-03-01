//require defaults
var fs = require('fs-extra');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var format = require('string-format');
var prompt = require('prompt');

//require bluemix
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

//setup vars
var workspaceID = 'cc40f1c0-a41c-4165-8631-161602a2eb24';

var conversation = new ConversationV1({
    username: "c5640430-789c-4003-bc54-cc0842ca5c87",
    password: "AY1nqFZpu63c",
    version_date: ConversationV1.VERSION_DATE_2017_02_03
});

var file = "/emails/test-emails.json";
var json = fs.readJsonSync(appDir + file, {throws: false});

function replaceString(input, newVals) {
    var format = require('string-format');

    var vals = newVals;

    if(!newVals) {
        vals = {
            name : 'David',
            mtype : 'coffee catchup'
        };
    }


    return format(input, vals);
};

function RunPrompt() {
    prompt.message = "Say to Penny";
    prompt.delimiter = ": ";
    prompt.start();

    prompt.get(['sender', 'dialog'], function(err, result) {

        var message = json.emailToSend;
        message = result.dialog;

        conversation.message({
            input: { text: message },
            workspace_id: workspaceID
        }, function(err, response) {
            var format = require('string-format');
            var colors = require('colors');

            if (err) {
                console.error(err);
            } else {

                var reply = response.output.text[0];
                var vals = {
                    name : result.sender
                };

                reply = replaceString(reply, vals);
                //console.log(response.output.text[0]);
                //var s = 'Penny - {0}'.format(reply);
                var pennyResponse = format('Penny replied: {0}\n', reply);
                console.log(pennyResponse.red);
                //console.log(JSON.stringify(response, null, 2));
                RunPrompt();
            }
        });
    });
};

RunPrompt();




