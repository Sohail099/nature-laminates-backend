const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'Mumbai'
});

const uploadImageToStorage = async (newFileName, file, token) => {
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

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(" see all*******&&&&Error : ", err);
        reject({
          status: false,
          message: 'Something is wrong! Unable to upload at the moment.'
        });
      } else {
        const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        resolve({
          status: true,
          url
        });
      }
    });
  });
};




// aws s3 bucket deletefile code


module.exports = {
  uploadImageToStorage,
  deleteDirectoryFromStorage,
}