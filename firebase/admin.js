const admin = require("firebase-admin");

const serviceAccount = require("./nature-laminates-firebase-adminsdk-oxiyb-96afb08e33.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://nature-laminates.appspot.com"
});

module.exports = admin;