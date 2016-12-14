console.log('firebase');

var admin = require("firebase-admin");
// Fetch the service account key JSON file contents
var serviceAccount = require("./adminsdk-f0r24-b506b9ce60.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://stableflow-66337.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("queue");
ref.on("child_changed", function(snapshot) {
    console.log(snapshot.val());
});