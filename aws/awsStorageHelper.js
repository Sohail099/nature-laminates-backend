const AWS = require('aws-sdk');

const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});


async function getServiceAccountFromS3() {
    const params = {
        Key: process.env.AWS_S3_SA_PATH,
        Bucket: process.env.AWS_S3_BUCKET
    };
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

const uploadImageToStorage = async (newFileName, file, token) => {
    console.log("uploadImageToStorage : ", newFileName)
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: newFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
            'awsBucketStorageDownloadTokens': token
        },
    };

    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No image file");
        }
        S3.upload(params, (err, data) => {
            if (err) {
                console.log("File Upload Error : ", err);
                reject({
                    status: false,
                    message: 'Something is wrong! Unable to upload at the moment.'
                });
            } else {
                const url = data.Location;
                resolve({
                    status: true,
                    url
                });
            }
        });
    });
};

const deleteDirectoryFromStorage = async (filePath) => {
    console.log("deleteDirectoryFromStorage : ", filePath);
    const listObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: filePath
    };
    return await new Promise((resolve, reject) => {
        S3.listObjectsV2(listObjectParams, (err, data) => {
            if (err) {
                console.log("Listing Directory Objects Error : ", err);
                reject({
                    status: false,
                    message: 'Something is wrong! Unable to list at the moment.'
                });
            }
            else {
                if (data.Contents.length) {
                    const deleteObjectsParam = {
                        Bucket: process.env.AWS_S3_BUCKET,
                    };

                    data.Contents.forEach(({ Key }) => {
                        deleteObjectsParam.Key = Key;
                    });
                    S3.deleteObject(deleteObjectsParam, (err, data) => {
                        if (err) {
                            console.log("Delete Directory Objects Error : ", err);
                            reject({
                                status: false,
                                message: 'Something is wrong! Unable to delete at the moment.'
                            });
                        }
                        resolve({
                            status: true
                        });
                    })
                }
                else {
                    resolve({
                        status: true
                    });
                }
            }
        });
    })
}

module.exports = {
    getServiceAccountFromS3,
    uploadImageToStorage,
    deleteDirectoryFromStorage
}