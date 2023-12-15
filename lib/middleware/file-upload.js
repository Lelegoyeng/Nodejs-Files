const formidable = require('formidable');
const fs = require('fs-extra');
const { appendSlash } = require('../helper');

const fileUpload = async (req, res, { path } = {}) => {
  const form = new formidable.IncomingForm();
  // Set up progress tracking
  form.on('progress', (bytesReceived, bytesExpected) => {
    const progress = Math.round((bytesReceived / bytesExpected) * 100);
    console.log(`Upload Progress: ${progress}%`);
    // You can emit an event, send a message to the client, or store the progress as needed.
  });


  await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      const oldpath = files.filetoupload.filepath;
      let newPath = appendSlash(path) + files.filetoupload.originalFilename;
      if (fs.existsSync(newPath)) {
        newPath = `${appendSlash(path) + new Date().getTime()}_${files.filetoupload.originalFilename}`;
      }
      try {
        fs.moveSync(oldpath, newPath);
      } catch (error) {
        reject(error);
      }
      resolve();
    });
  });
  return res.redirect('/');
};

module.exports = {
  fileUpload,
};
