/**
 * metadata.js
 * Returns file size and MD5 hash
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

const formidable = require('formidable');
const form = new formidable.IncomingForm();

// parser configuration
form.hash = 'md5';
form.multiples = true;

// execute callback with extracted form
// file(s) metadata from a HTTP stream
function metadata(stream, callback) {
  form.parse(stream, (error, fields, files) => {

    if (error) {
      callback(new Error());
      return;
    }

    if (!files.files) {
      callback(null, null);
      return;
    }

    if (!(files.files instanceof Array)) {
      callback(null, {name: files.files.name, size: files.files.size, md5: files.files.hash});
      return;
    }

    callback(null, files.files.reduce((accumulator, file) => {
      return accumulator.concat({name: file.name, size: file.size, md5: file.hash});
    }, []));

  });
};

module.exports = metadata;
