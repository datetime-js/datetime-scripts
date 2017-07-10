'use strict';

const path = require('path');
const utils = require('../utils');

module.exports = (version, outputDir) => {
  outputDir = `${path.resolve(outputDir)}/tzdata/${version}`;

  const download = require('./download')(version)(outputDir);
  const collect = require('./collect')(version)(outputDir);
  const dedupe = require('./dedupe')(version)(outputDir);
  const zic = require('./zic')(version)(outputDir);
  const zdump = require('./zdump')(version)(outputDir);
  const split = require('./split')(version)(outputDir);
  const umd = require('./umd')(version)(outputDir);

  utils.createDir(outputDir)
    .then(download)
    .then(zic)
    .then(zdump)
    .then(collect)
    .then(dedupe)
    .then(split)
    .then(umd)
    .then(() => {
      console.log('\nDone');
    })
    .catch(err => {
      console.log('Failed', err);
    });
};
