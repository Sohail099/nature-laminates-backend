const admin = require("firebase-admin");

const serviceAccount = require("./nature-laminates-firebase-adminsdk-oxiyb-f020cecd5a.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://nature-laminates.appspot.com"
});

module.exports = admin;