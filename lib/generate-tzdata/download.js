'use strict';

const utils = require('../utils');
const child_process = require('child_process');

const exec = child_process.exec;

module.exports = version => outputDir => () => new Promise((resolve, reject) => {
  console.log(`\nDownloading tzdata ${version}...`);

  const outputRawDir = `${outputDir}/raw`;

  utils.createDir(outputRawDir).then(() => {
    const downloadUrl = `http://www.iana.org/time-zones/repository/releases/tzdata${version}.tar.gz`;
    const outputFile = `${outputRawDir}/${version}.tar.gz`;

    const cmd = `curl -o ${outputFile} ${downloadUrl}`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return reject(stderr);
      }

      const cmd = `cd ${outputRawDir} && tar xvfz ${version}.tar.gz`;

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          if (err) {
            console.error(stderr);
            return reject(stderr);
          }
        }

        console.log(`Downloaded and unpacked tzdata ${version} into ${outputRawDir}`);
        resolve();
      });
    });
  });
})

