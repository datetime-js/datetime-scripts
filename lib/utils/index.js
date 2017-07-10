'use strict';

const fs = require('fs');
const path = require('path');

const glob = require('glob');
const mkdirp = require('mkdirp');

const createDir = dir => new Promise((resolve, reject) => {
  mkdirp(dir, err => err ? reject(err) : resolve());
});

const getFiles = (pattern, options) => new Promise((resolve, reject) => {
  glob(pattern, options, (err, files) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(files);
  })
});

// module.exports.fileExists = function fileExists (file) {
//   try {
//     return fs.statSync(file).isFile();
//   } catch (err) {
//     return false;
//   }
// };

const readFileSync = file => fs.readFileSync(file, 'utf-8');

const readJSON = file => JSON.parse(readFileSync(file));

// module.exports.tzdataExists = function tzdataExists (version, timezone) {
//   timezone = timezone || version + '-all';
//   var filename = path.resolve(__dirname, '../../tzdata/' + version + '/js/' + timezone + '.js');
//
//   return module.exports.fileExists(filename);
// };

const writeFile = (file, content) => new Promise((resolve, reject) => {
  fs.writeFile(file, content, err => {
    err ? reject(err) : resolve();
  });
});

const writeJSON = (file, content) => writeFile(
  file,
  JSON.stringify(content, null, 2)
);

Object.assign(module.exports, {
  createDir,
  getFiles,
  readFileSync,
  readJSON,
  writeFile,
  writeJSON,
})
