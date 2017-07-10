'use strict';

const path = require('path');
const utils = require('../utils');

const child_process = require('child_process');
const exec = child_process.exec;

module.exports = version => outputDir => () => Promise.resolve().then(() => {
  const outputZicDir = path.resolve(`${outputDir}/zic`);

  const files = [
    'africa',
    'antarctica',
    'asia',
    'australasia',
    'etcetera',
    'europe',
    'northamerica',
    'southamerica',
    'pacificnew',
    'backward'
  ];

  console.log(`\nCompiling zic files for tzdata ${version}...`);

  const compileZic = () => new Promise((resolve, reject) => {
    compileNextZic(files.shift(), resolve, reject);
  });

  const compileNextZic = (file, done, fail) => {
    const src = `${outputDir}/raw/${file}`;
    const cmd = `zic -d ${outputZicDir} ${src}`;

    exec(cmd, err => {
      if (err) {
        console.error(err);
        return fail(err);
      }

      if (files.length) {
        compileNextZic(files.shift(), done, fail);
      } else {
        done();
      }
    });
  }

  return utils
    .createDir(outputZicDir)
    .then(() => compileZic())
    .then(() => {
      console.log(`Compiled zic files for tzdata ${version} in ${outputZicDir}`);
    })
    .catch(err => {
      console.log('Failed to compile zic', err);
    });
});
