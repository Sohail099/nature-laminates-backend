const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const customRouter = require("./routers/routes");
const config = require("./config/config");
const logger = require("./utils/other/logger");
const cluster = require('cluster');
const multer = require('multer');
const storage = multer.memoryStorage()
let numCPUs = require('os').cpus().length;
const PORT = config.port;
const upload = multer({ storage: storage });
const { sendWarningToSlack } = require('./helpers/slackHelper');

// if (numCPUs > 4) {
//     numCPUs = 1;
// }
<<<<<<< HEAD
const AWS = require('aws-sdk');
const admin = require('firebase-admin');
const { sendWarningToSlack } = require('./helpers/slackHelper');

const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET
});

const params = {
    Key: process.env.AWS_S3_SA_PATH,
    Bucket: process.env.AWS_S3_BUCKET
};

async function getServiceAccountFromS3() {
    return new Promise((resolve, reject) => {
        S3.getObject(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const serviceAccount = JSON.parse(data.Body.toString());
                resolve(serviceAccount);
            }
        });
    });
}

async function initializeFirebaseAdmin() {
    try {
        const serviceAccount = await getServiceAccountFromS3();
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "gs://nature-laminates.appspot.com"
        });

        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
    }
}

initializeFirebaseAdmin();
=======
>>>>>>> 0c03b3573dcd9ab46334720e1562e0d50ab1fcdc

if (cluster.isMaster) {
    // create a worker for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        // logger.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on('exit', (worker, code, signal) => {
        logger.error(`worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`);
        cluster.fork();
    });
} else {
    //create express app
    const app = express();
    const router = express.Router();
    // view engine setup
    // app.set('views', path.join(__dirname, 'views'));
    // app.set('view engine', 'pug');
    // app.use(fileUpload({
    //     createParentPath: true
    // }));
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(cors()); // Use cors
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(router);  // tell the app this is the router we are using

    // User auth routes
    router.use("/api",
        upload.any(),
        (req, res, next) => {
            let oldSend = res.send;
            res.send = function (data) {
                if (res.statusCode >= 500) {
                    logger.error(`@ ${new Date().toISOString()} || ${req.originalUrl} || ${res.statusCode}`);
                    sendWarningToSlack(req, res, data)
                }
                else {
                    logger.info(`@${new Date().toISOString()} || ${req.originalUrl} || ${res.statusCode}`);
                }
                oldSend.apply(res, arguments)
            }
            next();
        }, customRouter);

    app.listen(PORT, function () {
        logger.info(`worker started: ${cluster.worker.id} | server listening on port: ${PORT}`);
    });
}

