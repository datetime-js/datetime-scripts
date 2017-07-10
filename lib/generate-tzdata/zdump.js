'use strict';

const path = require('path');
const utils = require('../utils');

const child_process = require('child_process');
const exec = child_process.exec;

module.exports = version => outputDir => () => Promise.resolve().then(() => {
  const zicDir = `${outputDir}/zic`;
  const outputZdumpDir = `${outputDir}/zdump`;

  console.log(`\nCompiling zdump files for tzdata ${version}...`);

  const dumpFile = file => new Promise((resolve, reject) => {
    const name = file.replace(zicDir + '/', '');
    const outputZicFile =  `${outputZdumpDir}/${name}.zdump`;
    const outputZicFileDir = path.dirname(outputZicFile);

    const cmd = `zdump -v ${file}`;

    exec(cmd, { maxBuffer: 20*1024*1024 }, (err, stdout) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      utils.createDir(outputZicFileDir)
        .then(() => {
          const output = stdout.replace(new RegExp(`${zicDir}/`, 'g'), '');
          return utils.writeFile(outputZicFile, output);
        })
        .then(resolve)
        .catch(reject)
    });
  });

  const dumpAll = files => new Promise((resolve, reject) => {
    const dumpNext = () => {
      const file = files.shift();

      dumpFile(file)
        .then(() => {
          if (files.length) {
            dumpNext();
          } else {
            resolve();
          }
        })
        .catch(reject);
    };

    dumpNext();
  });

  const getZicFiles = () => utils.getFiles(`${zicDir}/**/*`, { nodir: true });

  return utils.createDir(outputZdumpDir)
    .then(getZicFiles)
    .then(dumpAll)
    .then(() => {
      console.log(`Compiled zdump files for tzdata ${version} in ${outputZdumpDir}`);
    })
    .catch(err => {
      console.log('Failed to compile zdump', err);
    });
});
