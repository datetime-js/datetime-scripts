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

const fileExists = filename => {
  try {
    return fs.statSync(filename).isFile();
  } catch (err) {
    return false;
  }
};

const readFileSync = file => fs.readFileSync(file, 'utf-8');

const readJSON = file => JSON.parse(readFileSync(file));

const getTimezoneJs = (tzdataRootDir, timezone, version) => {
  timezone = timezone || `${version}-all`;
  return path.resolve(tzdataRootDir, `./js/${timezone}.js`);
};

const tzdataExists = (tzdataRootDir, timezone, version) => fileExists(
  getTimezoneJs(tzdataRootDir, timezone, version)
);

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
  fileExists,
  getFiles,
  getTimezoneJs,
  readFileSync,
  readJSON,
  tzdataExists,
  writeFile,
  writeJSON,
})
