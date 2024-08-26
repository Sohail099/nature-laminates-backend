const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.REGION
});

const uploadImageToS3Storage = async (newFileName, file, token) => {
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
const deleteDirectoryFromStorage = async (fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName
  };

  return new Promise((resolve, reject) => {
    if (!fileName) {
      return reject({
        statusCode: 400,
        status: 'error',
        message: 'No file name provided'
      });
    }

    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error("Error deleting file from S3:", data); // Enhanced error logging
        return reject({
          statusCode: 500,
          status: 'error',
          message: 'Unable to delete the file at the moment.',
          error: err.message // Including specific error message for debugging
        });
      } else {
        return resolve({
          statusCode: 200,
          status: 'success',
          message: '^^^^^^^^^^^^^^^^^^^^^^^^^^File deleted successfully'
        });
      }
    });
  });
};


const deleteDirectoryFromStoragev2 = async (filePath) => {
  console.log("deleteDirectoryFromStorage : ", filePath);
  // const bucket = firebaseAdmin.storage().bucket();
  const listObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: filePath
  };
  return await new Promise((resolve, reject) => {
      s3.listObjectsV2(listObjectParams, (err, data) => {
          if (err) {
              console.log("Listing Directory Objects Error : ", err);
              reject({
                  status: false,
                  message: 'Something is wrong! Unable to list at the moment.'
              });
          }
          else {
              console.log("Data : ", data)
              if (data.Contents.length) {
                  console.log("Inside if")
                  const deleteObjectsParam = {
                      Bucket: process.env.AWS_S3_BUCKET,
                  };
                  data.Contents.forEach(({ Key }) => {
                      console.log("Key : ", Key);
                      deleteObjectsParam.Key = Key;
                  });
                  console.log("To be deleted : ", deleteObjectsParam)
                  s3.deleteObject(deleteObjectsParam, (err, data) => {
                      if (err) {
                          console.log("Delete Directory Objects Error : ", err);
                          reject({
                              status: false,
                              message: 'Something is wrong! Unable to delete at the moment.'
                          });
                      }
                      console.log("Objects Data : ", data);
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
  uploadImageToS3Storage,
   deleteDirectoryFromStorage,
   deleteDirectoryFromStoragev2
}
