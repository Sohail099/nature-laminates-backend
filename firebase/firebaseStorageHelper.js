const firebaseAdmin = require("./admin");
const bucket = firebaseAdmin.storage().bucket();

const uploadImageToStorage = (newFileName, file, token) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    console.log("inside storage upload")

    let fileUploadBucket = bucket.file(newFileName);

    const blobStream = fileUploadBucket.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    blobStream.on('error', (error) => {
      reject({
        status: false,
        message: 'Something is wrong! Unable to upload at the moment.'
      });
    });
    blobStream.on("finish", () => {
      const url =
        "https://firebasestorage.googleapis.com/v0/b/" +
        bucket.name +
        "/o/" +
        encodeURIComponent(newFileName) +
        "?alt=media&token=" +
        token;
      resolve({
        status: true,
        url
      });
    });
    blobStream.end(file.buffer);
  });
};

const deleteDirectoryFromStorage = async (filePath) => {
  console.log('deleteDirectoryFromStorage');

  return await new Promise((resolve, reject) => {
    bucket.deleteFiles({
      prefix: filePath
    }).then((result) => {
      resolve(true)
    }).catch((e) => {
      reject(false)
    })
  })

}
module.exports = {
  uploadImageToStorage,
  deleteDirectoryFromStorage
}