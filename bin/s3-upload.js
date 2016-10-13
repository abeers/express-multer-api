'use strict';

const fs = require('fs');
const fileType = require('file-type');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const upload = (file) => {
  const options = {
    Bucket: 'bucketforbeers',
    Body: file.data,
    ACL: 'public-read',
    ContentType: file.mime,
    Key: `test/test.${file.ext}`
  };
  return Promise.resolve(options);
};

const logMessage = (upload) => {
  delete upload.Body;
  console.log(`The upload options are ${JSON.stringify(upload)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error);
