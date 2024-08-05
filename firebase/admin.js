const admin = require("firebase-admin");

const serviceAccount = require("./nature-laminates-firebase-adminsdk-oxiyb-9aea4f53c9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://nature-laminates.appspot.com"
});

module.exports = admin;